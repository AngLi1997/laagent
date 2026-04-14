# -*- coding: utf-8 -*-
# @Time    : 2025/4/10 17:15
# @Author  : liang
# @FileName: knowledge_base_document_relationship.py.py
# @Software: PyCharm
"""知识库管理"""
from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint
from loguru import logger

from app.app_init import app
from app.blueprints.document_blueprint import validate_documents
from app.blueprints.permission_resource_blueprint import save_resources_permission
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.common_enum import EnableStatus
from app.data_permission.data_perm import data_permission
from app.entities.document import BaDocument, BaDocumentCategory
from app.entities.knowledge_base import BaKnowledgeBaseCategory, BaKnowledgeBase, get_documents_by_kb
from app.entities.knowledge_base_document_relationship import BaKnowledgeBaseDocumentRelationship
from app.exception.exception_handler import BmosException
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.document import DocumentInfo, DocumentRetrievalChunk
from app.models.knowledge_base import KnowledgeBaseCategoryCreateDTO, KnowledgeBaseCategory, \
    KnowledgeBaseCategoryEditDTO, KnowledgeBaseCreateDTO, KnowledgeBaseEditDTO, KnowledgeBasePageResponse, \
    KnowledgeBasePageRequest, KnowledgeBaseRetrievalQuery, KnowledgeBaseInfo
from app.models.permission_resource import ResourcesCreateDTO
from app.utils import user_util
from app.utils.tree_util import build_tree

knowledge_base_tag = Tag(name='知识库管理')
knowledge_base_bp = APIBlueprint('knowledge_base', __name__, url_prefix='/knowledge/base')


@knowledge_base_bp.post('/category', summary="创建知识库分类", tags=[knowledge_base_tag], responses={200: Resp[str]})
def create_knowledge_base_category(body: KnowledgeBaseCategoryCreateDTO):
    if body.parent_id:
        parent = BaKnowledgeBaseCategory.query.get(body.parent_id)
        if not parent:
            raise BmosException(_(TRANSLATIONS['parent_point_not_exist']))
    if BaKnowledgeBaseCategory.query.filter_by(name=body.name).first():
        raise BmosException(_(TRANSLATIONS['knowledge_category_name_exist']))
    logger.info(f'创建文档分类: category_name: {body.name}')
    dc = BaKnowledgeBaseCategory(body.parent_id, body.name)
    with app.db.auto_commit_db():
        app.db.session.add(dc)
        app.db.session.flush()
        return Resp.success(dc.id)


@knowledge_base_bp.get('/category/tree', summary="知识库分类树", tags=[knowledge_base_tag],
                       responses={200: Resp[list[KnowledgeBaseCategory]]})
def list_category_tree():
    c_list = [KnowledgeBaseCategory(id=d.id, name=d.name, parent_id=d.parent_id, children=[]) for d in
              BaKnowledgeBaseCategory.query.all()]
    c_tree = build_tree(c_list)
    return Resp.success(c_tree)


@knowledge_base_bp.delete('/category', summary="删除知识库分类", tags=[knowledge_base_tag], responses={200: Resp[str]})
def delete_category(query: IdDTO):
    _validate_knowledge_base_category_and_get(query.id)
    children = BaKnowledgeBaseCategory.get_children(query.id)
    if len(children) > 0:
        raise BmosException(_(TRANSLATIONS['knowledge_category_has_child']))
    if BaKnowledgeBase.query.filter_by(category_id=query.id).first():
        raise BmosException(_(TRANSLATIONS['category_has_knowledge']))
    logger.info(f'删除知识库分类 knowledge_base_id: {query.id}')
    with app.db.auto_commit_db():
        BaKnowledgeBaseCategory.query.filter_by(id=query.id).delete()
        return Resp.success(query.id)


@knowledge_base_bp.put('/category', summary="编辑知识库分类", tags=[knowledge_base_tag], responses={200: Resp[str]})
def edit_category(body: KnowledgeBaseCategoryEditDTO):
    _validate_knowledge_base_category_and_get(body.id)
    if BaKnowledgeBaseCategory.query.filter(BaKnowledgeBaseCategory.name == body.name,
                                            BaKnowledgeBaseCategory.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['knowledge_category_name_exist']))
    logger.info(f'编辑知识库 knowledge_base_id: {body.id}')
    with app.db.auto_commit_db():
        BaKnowledgeBaseCategory.query.filter_by(id=body.id).update({"name": body.name})
        return Resp.success(body.id)


@knowledge_base_bp.post('/create', summary="创建知识库并返回知识库id", tags=[knowledge_base_tag],
                        responses={200: Resp[str]})
def create_knowledge_base(body: KnowledgeBaseCreateDTO):
    _validate_knowledge_base_category_and_get(body.category_id)
    validate_documents(body.document_ids)

    if BaKnowledgeBase.query.filter_by(serial=body.serial).first():
        raise BmosException(_(TRANSLATIONS['knowledge_id_exist']))
    if BaKnowledgeBase.query.filter_by(name=body.name).first():
        raise BmosException(_(TRANSLATIONS['knowledge_name_exist']))
    logger.info(f'创建知识库 knowledge_base: {body.name}')

    kb = BaKnowledgeBase(category_id=body.category_id, serial=body.serial, name=body.name, status=EnableStatus.ENABLE)
    docs = BaDocument.query.filter(BaDocument.id.in_(body.document_ids)).all()
    with app.db.auto_commit_db():
        app.db.session.add(kb)
        app.db.session.flush()
        BaKnowledgeBaseDocumentRelationship.query.filter(
            BaKnowledgeBaseDocumentRelationship.knowledge_base_id == kb.id).delete()
        for doc in docs:
            app.db.session.add(BaKnowledgeBaseDocumentRelationship(knowledge_base_id=kb.id, document_id=doc.id))
        # 保存数据权限
        save_resources_permission(ResourcesCreateDTO(dept_ids=body.dept_ids, resource_id=kb.id))
        return Resp.success(kb.id)


@knowledge_base_bp.put('/edit', summary="编辑知识库信息", tags=[knowledge_base_tag], responses={200: Resp[str]})
def edit_knowledge_base(body: KnowledgeBaseEditDTO):
    kb = _validate_knowledge_base_and_get(body.id)
    _validate_knowledge_base_category_and_get(body.category_id)
    docs = validate_documents(body.document_ids)
    if BaKnowledgeBase.query.filter(BaKnowledgeBase.name == body.name, BaKnowledgeBase.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['knowledge_name_exist']))
    if BaKnowledgeBase.query.filter(BaKnowledgeBase.serial == body.serial, BaKnowledgeBase.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['knowledge_id_exist']))
    logger.info(f'编辑知识库 knowledge_base: {body.name}')
    with app.db.auto_commit_db():
        kb.category_id = body.category_id
        kb.name = body.name
        kb.serial = body.serial
        BaKnowledgeBaseDocumentRelationship.query.filter(BaKnowledgeBaseDocumentRelationship.knowledge_base_id == kb.id).delete()
        for doc in docs:
            app.db.session.add(BaKnowledgeBaseDocumentRelationship(knowledge_base_id=kb.id, document_id=doc.id))
        return Resp.success(body.id)


@knowledge_base_bp.get('/page', summary="查询知识库分页", tags=[knowledge_base_tag],
                       responses={200: Resp[PageResponse[KnowledgeBasePageResponse]]})
@data_permission()
def query_knowledge_base_page(query: KnowledgeBasePageRequest):
    q = (BaKnowledgeBase.query
         .order_by(BaKnowledgeBase.create_time.desc())
         .add_entity(BaKnowledgeBaseCategory)
         .join(BaKnowledgeBaseCategory, BaKnowledgeBaseCategory.id == BaKnowledgeBase.category_id, isouter=True))
    if query.name:
        q = q.filter(BaKnowledgeBase.name.like(f'%{query.name}%'))
    if query.serial:
        q = q.filter(BaKnowledgeBase.serial.like(f'${query.serial}'))
    if query.category_id:
        # 递归查询所有分类
        ids = [c.id for c in BaKnowledgeBaseCategory.get_all_children(query.category_id)]
        q = q.filter(BaKnowledgeBase.category_id.in_(ids))
    pagination = q.paginate(page=query.page_num, per_page=query.page_size, error_out=False)
    pagination.items = [KnowledgeBasePageResponse(
        id=kb.id,
        name=kb.name,
        serial=kb.serial,
        category_id=category.id if category else None,
        category_name=category.name if category else None,
        status=kb.status,
        update_time=kb.update_time,
        update_user=user_util.get_user_name(kb.update_user)
    ) for kb, category in pagination.items]
    return Resp.success(PageResponse(pagination))


@knowledge_base_bp.put('/enable', summary='启用知识库', tags=[knowledge_base_tag], responses={200: Resp[str]})
def enable_knowledge_base(query: IdDTO):
    kb = _validate_knowledge_base_and_get(query.id)
    if kb.status == EnableStatus.ENABLE:
        raise BmosException(_(TRANSLATIONS['knowledge_enabled']))
    with app.db.auto_commit_db():
        logger.info(f'知识库启用 kb_id: {query.id}')
        BaKnowledgeBase.query.filter_by(id=query.id).update({'status': EnableStatus.ENABLE})
        return Resp.success(query.id)


@knowledge_base_bp.get('/info', summary='查询知识库详情', tags=[knowledge_base_tag],
                       responses={200: Resp[KnowledgeBaseInfo]})
def query_knowledge_base(query: IdDTO):
    kb = _validate_knowledge_base_and_get(query.id)
    c = _validate_knowledge_base_category_and_get(kb.category_id)
    bc_list = BaDocumentCategory.query.filter(BaDocumentCategory.id.in_([d.category_id for d in get_documents_by_kb(kb)]))
    bc_dict = {bc.id: bc for bc in bc_list}
    result = KnowledgeBaseInfo(
        id=kb.id,
        name=kb.name,
        serial=kb.serial,
        category_id=c.id,
        category_name=c.name,
        status=kb.status,
        update_time=kb.update_time,
        update_user=kb.update_user,
        documents=[DocumentInfo(
            id=doc.id,
            name=doc.name,
            serial=doc.serial,
            status=doc.status,
            update_time=doc.update_time,
            update_user=doc.update_user
            , category_id=bc_dict.get(doc.category_id).id, category_name=bc_dict.get(doc.category_id).name) for doc in
            get_documents_by_kb(kb)]
    )
    return Resp.success(result)


@knowledge_base_bp.put('/disable', summary='停用知识库', tags=[knowledge_base_tag], responses={200: Resp[str]})
def disable_knowledge_base(query: IdDTO):
    kb = _validate_knowledge_base_and_get(query.id)
    if kb.status == EnableStatus.DISABLE:
        raise BmosException(_(TRANSLATIONS['knowledge_disabled']))
    with app.db.auto_commit_db():
        logger.info(f'知识库停用 kb_id: {query.id}')
        BaKnowledgeBase.query.filter_by(id=query.id).update({'status': EnableStatus.DISABLE})
        return Resp.success(query.id)


@knowledge_base_bp.delete('/delete', summary='删除知识库', tags=[knowledge_base_tag], responses={200: Resp[str]})
def delete_knowledge(query: IdDTO):
    _validate_knowledge_base_and_get(query.id)
    with app.db.auto_commit_db():
        logger.info(f'删除知识库 doc_id={query.id}')
        BaKnowledgeBase.query.filter_by(id=query.id).delete()
    return Resp.success(query.id)


@knowledge_base_bp.post('/retrieval', summary='知识库召回测试', tags=[knowledge_base_tag],
                        responses={200: Resp[list[DocumentRetrievalChunk]]})
def knowledge_retrieval(body: KnowledgeBaseRetrievalQuery):
    kb = _validate_knowledge_base_and_get(body.knowledge_base_id)
    doc_ids = [doc.id for doc in get_documents_by_kb(kb)]
    from app.core.agent.knowledge.document.document import retrieval_chunks
    return Resp.success(
        retrieval_chunks([kb.id], doc_ids, body.text, body.matching_type, body.top_k, body.score_threshold, body.rerank))


def _validate_knowledge_base_category_and_get(category_id: str) -> BaKnowledgeBaseCategory | None:
    if not category_id:
        return None
    """校验知识库分类id并返回知识库分类信息"""
    category = BaKnowledgeBaseCategory.query.get(category_id)
    if not category:
        raise BmosException(_(TRANSLATIONS['knowledge_category_not_exist']))
    return category


def _validate_knowledge_base_and_get(knowledge_base_id: str) -> BaKnowledgeBase:
    """校验文档id并返回文档信息"""
    kb = BaKnowledgeBase.query.get(knowledge_base_id)
    if not kb:
        raise BmosException(_(TRANSLATIONS['knowledge_not_exist']))
    return kb


def _validate_knowledge_bases(knowledge_base_ids: list[str]):
    """批量校验知识库是否存在"""
    if not knowledge_base_ids:
        return
    """校验知识库id并返回知识库信息"""
    kbs = BaKnowledgeBase.query.filter(BaKnowledgeBase.id.in_(knowledge_base_ids)).all()
    if len(kbs) != len(knowledge_base_ids):
        raise BmosException(_(TRANSLATIONS['knowledge_not_exist']))
