# -*- coding: utf-8 -*-
# @Time    : 2025/4/2 16:09
# @Author  : liang
# @FileName: naocs.py.py
# @Software: PyCharm
"""文档管理"""
from io import BytesIO
from tempfile import NamedTemporaryFile

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint, FileStorage
from loguru import logger
from sqlalchemy import desc

from app.app_init import app
from app.blueprints.permission_resource_blueprint import save_resources_permission
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.common_enum import EnableStatus
from app.core.agent.vector.document_vector import BmosChunkTask
from app.data_permission.data_perm import data_permission, _get_user_dept_ids, is_admin
from app.entities.document import BaDocumentChunk, BaDocument, BaDocumentCategory, \
    file_storage_to_ba_document
from app.entities.permission_resource import BaResources
from app.exception.exception_handler import BmosException
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.document import DocumentSplitDTO, DocumentChunk, \
    DocumentChunkInfo, DocumentCategoryCreateDTO, DocumentCategory, DocumentPageRequest, DocumentPageResponse, \
    DocumentRetrievalQuery, DocumentRetrievalChunk, DocumentChunkEditDTO, DocumentChunkCreateDTO, DocumentCreateDTO, \
    DocumentCategoryEditDTO, DocumentEditDTO, DocumentChunkPageResponse, DocumentChunkPageRequest, \
    DocumentCategoryWithDocument, DocumentItem
from app.models.permission_resource import ResourcesCreateDTO
from app.utils import user_util
from app.utils.file_util import get_file_type
from app.utils.serial_util import generate_serial
from app.utils.tree_util import build_tree

document_tag = Tag(name='文档管理')
document_bp = APIBlueprint('document', __name__, url_prefix='/knowledge/document')

@document_bp.post('/category', summary="创建文档分类", tags=[document_tag], responses={200: Resp[str]})
def create_document_category(body: DocumentCategoryCreateDTO):
    if body.parent_id:
        parent = BaDocumentCategory.query.get(body.parent_id)
        if not parent:
            raise BmosException(_(TRANSLATIONS['parent_point_not_exist']))
    if BaDocumentCategory.query.filter_by(name=body.name).first():
        raise BmosException(_(TRANSLATIONS['document_category_name_exist']))
    logger.info(f'创建文档分类: category_name: {body.name}')
    dc = BaDocumentCategory(body.parent_id, body.name)
    with app.db.auto_commit_db():
        app.db.session.add(dc)
        app.db.session.flush()
        return Resp.success(dc.id)


@document_bp.get('/category/tree', summary="文档分类树", tags=[document_tag],
                 responses={200: Resp[list[DocumentCategory]]})
def list_category_tree():
    c_list = [DocumentCategory(id=d.id, name=d.name, parent_id=d.parent_id, children=[]) for d in
              BaDocumentCategory.query.all()]
    c_tree = build_tree(c_list)
    return Resp.success(c_tree)


@document_bp.get('/category/documents_tree', summary="文档分类树(带文档列表)", tags=[document_tag],
                 responses={200: Resp[list[DocumentCategoryWithDocument]]})
def list_category_tree_with_documents():
    logger.info('获取文档列表')
    doc_dict = {}
    query = BaDocument.query
    # 权限过滤
    if not is_admin():
        dept_ids = _get_user_dept_ids()
        r_id_list = [r.resource_id for r in BaResources.query.filter(BaResources.dept_id.in_(dept_ids)).all()]
        query = query.filter(BaDocument.id.in_(r_id_list))

    ba_document_list = query.all()
    for doc in ba_document_list:
        doc_dict.setdefault(doc.category_id, []).append(
            DocumentItem(id=doc.id, name=doc.name, summary=doc.summary)
        )
    c_list = [DocumentCategoryWithDocument(id=d.id, name=d.name, parent_id=d.parent_id, children=[],
                                           documents=doc_dict.get(d.id, [])) for d in
              BaDocumentCategory.query.all()]
    c_tree = build_tree(c_list)
    return Resp.success(c_tree)


@document_bp.delete('/category', summary="删除文档分类", tags=[document_tag], responses={200: Resp[str]})
def delete_category(query: IdDTO):
    _validate_document_category_and_get(query.id)
    children = BaDocumentCategory.get_children(query.id)
    if len(children) > 0:
        raise BmosException(_(TRANSLATIONS['category_has_child']))
    if BaDocument.query.filter_by(category_id=query.id).first():
        raise BmosException(_(TRANSLATIONS['category_has_document']))
    logger.info(f'删除文档 doc_id: {query.id}')
    with app.db.auto_commit_db():
        BaDocumentCategory.query.filter_by(id=query.id).delete()
        return Resp.success(query.id)


@document_bp.put('/category', summary="编辑文档分类", tags=[document_tag], responses={200: Resp[str]})
def edit_category(body: DocumentCategoryEditDTO):
    _validate_document_category_and_get(body.id)
    if BaDocumentCategory.query.filter(BaDocumentCategory.name == body.name,
                                       BaDocumentCategory.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['document_category_name_exist']))
    logger.info(f'编辑文档 doc_id: {body.id}')
    with app.db.auto_commit_db():
        BaDocumentCategory.query.filter_by(id=body.id).update({"name": body.name})
        return Resp.success(body.id)


# @document_bp.post('/upload', summary="上传文档并返回文件id", tags=[document_tag], responses={200: Resp[str]})
# def upload_document(form: DocumentUploadDTO):
#     # file = form.file
#     safe_file_name = __validate_file_name(form.name)
#     return Resp.success(
#         __save_file_storage_to_document(form.document_url, safe_file_name, form.serial, form.category_id, form.dept_ids))


@document_bp.post('/create', summary="创建文档并返回文件id", tags=[document_tag], responses={200: Resp[str]})
def create_document(body: DocumentCreateDTO):
    safe_file_name = __validate_file_name(body.name)
    if body.content:
        file = FileStorage(BytesIO(body.content.encode('utf-8')), filename=safe_file_name, content_type='text/plain')
        url = app.minio_client.upload_file_storage(file, file.filename)
    else:
        url = body.document_url
    return Resp.success(__save_file_storage_to_document(url, safe_file_name, body.serial, body.category_id, body.dept_ids))



@document_bp.post('/split', summary="文档分段（预览）", tags=[document_tag],
                  responses={200: Resp[DocumentChunkInfo]})
def split_document(body: DocumentSplitDTO):
    logger.info(f'文档分段：{body}')
    doc_list = _get_doc_chunks(body)
    if doc_list is None:
        return Resp.fail(_(TRANSLATIONS['document_not_exist']))
    # 纯预览 不做处理 直接返回
    return Resp.success(doc_list)


@document_bp.post('/split/save', summary="文档分段保存", tags=[document_tag],
                  responses={200: Resp[DocumentChunkInfo]})
def split_document_save(body: DocumentSplitDTO):
    logger.info(f'文档分段保存：{body}')
    doc_list = _get_doc_chunks(body)

    # 保存到数据库
    result = [BaDocumentChunk(doc_list.document_id, doc.chunk_index, doc.content, doc.length) for doc in
              doc_list.chunk_list]

    with app.db.auto_commit_db():
        # 删除之前的
        chunks = BaDocumentChunk.query.filter_by(document_id=doc_list.document_id).all()
        chunk_ids = [chunk.id for chunk in chunks]
        BaDocumentChunk.query.filter_by(document_id=doc_list.document_id).delete()
        app.document_vector_store.delete_vector(chunk_ids)
        # 新增
        app.db.session.bulk_save_objects(result, return_defaults=True)

    from app.celery.celery_tasks import extract_keywords_task, to_vector_task
    for chunk in result:
        chunk_task = BmosChunkTask(document_id=chunk.document_id, chunk_id=str(chunk.id), content=chunk.content)
        # 提取关键词
        logger.info(f'添加【提取关键词】任务')
        extract_keywords_task.delay(chunk_task)
        # 向量化
        logger.info(f'添加【向量化】任务')
        to_vector_task.delay(chunk_task)
    return Resp.success(doc_list)


@document_bp.put('/edit', summary="编辑文档信息", tags=[document_tag], responses={200: Resp[str]})
def edit_document(body: DocumentEditDTO):
    _validate_document_and_get(body.id)
    _validate_document_category_and_get(body.category_id)
    if BaDocument.query.filter(BaDocument.name == body.name, BaDocument.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['document_name_exist']))
    if BaDocumentCategory.query.filter(BaDocument.serial == body.serial, BaDocument.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['document_id_exist']))
    logger.info(f'编辑文档 doc_id: {body.id}')
    with app.db.auto_commit_db():
        BaDocument.query.filter_by(id=body.id).update(
            {"name": body.name, "serial": body.serial, "category_id": body.category_id})
    return Resp.success(body.id)


@document_bp.get('/page', summary="查询文档分页", tags=[document_tag],
                 responses={200: Resp[PageResponse[DocumentPageResponse]]})
@data_permission()
def query_document_page(query: DocumentPageRequest):
    q = (BaDocument.query
        .order_by(desc(BaDocument.create_time))
         .add_entity(BaDocumentCategory)
         .join(BaDocumentCategory, BaDocumentCategory.id == BaDocument.category_id, isouter=True))
    # 条件搜索
    if query.category_id:
        # 递归查询所有分类
        ids = [c.id for c in BaDocumentCategory.get_all_children(query.category_id)]
        q = q.filter(BaDocument.category_id.in_(ids))
    if query.name:
        q = q.filter(BaDocument.name.like(f'%{query.name}%'))
    if query.serial:
        q = q.filter(BaDocument.serial.like(f'%{query.serial}%'))
    # 分页查询
    page = q.paginate(page=query.page_num, per_page=query.page_size, error_out=False)
    # 视图转换
    page.items = [DocumentPageResponse(
        id=document.id,
        name=document.name,
        serial=document.serial,
        category_id=category.id,
        category_name=category.name,
        update_time=document.update_time,
        update_user=user_util.get_user_name(document.update_user),
        status=document.status) for document, category in page.items]
    # 返回
    return Resp.success(PageResponse(page))


@document_bp.put('/enable', summary='启用文档', tags=[document_tag], responses={200: Resp[str]})
def enable_document(query: IdDTO):
    doc = _validate_document_and_get(query.id)
    if doc.status == EnableStatus.ENABLE:
        raise BmosException(_(TRANSLATIONS['document_enabled']))
    with app.db.auto_commit_db():
        logger.info(f'文档启用 doc_id: {query.id}')
        BaDocument.query.filter_by(id=query.id).update({'status': EnableStatus.ENABLE})
        return Resp.success(query.id)


@document_bp.put('/disable', summary='停用文档', tags=[document_tag], responses={200: Resp[str]})
def disable_document(query: IdDTO):
    doc = _validate_document_and_get(query.id)
    if doc.status == EnableStatus.DISABLE:
        raise BmosException(_(TRANSLATIONS['document_disabled']))
    with app.db.auto_commit_db():
        logger.info(f'文档停用 doc_id: {query.id}')
        BaDocument.query.filter_by(id=query.id).update({'status': EnableStatus.DISABLE})
        return Resp.success(query.id)


@document_bp.post('/retrieval', summary='文档召回测试', tags=[document_tag],
                  responses={200: Resp[list[DocumentRetrievalChunk]]})
def document_retrieval(body: DocumentRetrievalQuery):
    _validate_document_and_get(body.document_id)
    from app.core.agent.knowledge.document.document import retrieval_chunks
    return Resp.success(
        retrieval_chunks([], [body.document_id], body.text, body.matching_type, body.top_k, body.score_threshold,
                         body.rerank))


@document_bp.get('/chunk', summary='查看文本片段', tags=[document_tag], responses={200: Resp[DocumentChunk]})
def get_chunk(query: IdDTO):
    chunk = _validate_chunk_and_get(query.id)
    res = DocumentChunk(**chunk.to_dict(), retrieval_count=0)
    return Resp.success(res)


@document_bp.get('/chunk/page', summary="查询文档分段分页", tags=[document_tag],
                 responses={200: Resp[PageResponse[DocumentChunkPageResponse]]})
def query_document_chunk_page(query: DocumentChunkPageRequest):
    q = (BaDocumentChunk.query.filter_by(document_id=query.document_id)
         .order_by(BaDocumentChunk.chunk_index))
    if query.content:
        q = q.filter(BaDocumentChunk.content.ilike(f'%{query.content}%'))
    page = q.paginate(page=query.page_num, per_page=query.page_size, error_out=False)
    page.items = [DocumentChunkPageResponse(
        id=chunk.id,
        chunk_index=chunk.chunk_index,
        length=chunk.length,
        content=chunk.content,
        keywords=chunk.keywords,
        retrieval_count=chunk.retrieval_count) for chunk in page.items]
    return Resp.success(PageResponse(page))


@document_bp.post('/chunk', summary='新增文本片段', tags=[document_tag], responses={200: Resp[str]})
def create_chunk(body: DocumentChunkCreateDTO):
    _validate_document_and_get(body.document_id)
    max_index = BaDocumentChunk.query.filter_by(document_id=body.document_id).order_by(
        desc(BaDocumentChunk.chunk_index)).first()
    chunk_index = max_index.chunk_index + 1 if max_index else 1
    with app.db.auto_commit_db():
        logger.info(f'新增文本片段 chunk_index={chunk_index}')
        chunk = BaDocumentChunk(document_id=body.document_id,
                                chunk_index=chunk_index,
                                content=body.content,
                                length=len(body.content),
                                keywords=body.keywords)
        app.db.session.add(chunk)
        app.db.session.flush()
    logger.info(f'新增文本片段向量: chunk_id={chunk.id}')
    from app.celery.celery_tasks import to_vector_task
    to_vector_task.delay(BmosChunkTask(document_id=body.document_id, chunk_id=chunk.id, content=body.content))
    return Resp.success(chunk.id)


@document_bp.put('/chunk', summary='修改文本片段', tags=[document_tag], responses={200: Resp[str]})
def edit_chunk(body: DocumentChunkEditDTO):
    chunk = _validate_chunk_and_get(body.id)
    with app.db.auto_commit_db():
        logger.info(f'修改文本片段 chunk_id={body.id}')
        BaDocumentChunk.query.filter_by(id=body.id).update({'content': body.content,
                                                            'keywords': body.keywords,
                                                            'length': len(body.content)})
    logger.info(f'更新文本片段向量: chunk_id={body.id}')
    from app.celery.celery_tasks import to_vector_task
    to_vector_task.delay(BmosChunkTask(document_id=chunk.document_id, chunk_id=body.id, content=body.content))
    return Resp.success(body.id)


@document_bp.delete('/chunk', summary='删除文本片段', tags=[document_tag], responses={200: Resp[str]})
def delete_chunk(query: IdDTO):
    _validate_chunk_and_get(query.id)
    with app.db.auto_commit_db():
        logger.info(f'删除文本片段 chunk_id={query.id}')
        BaDocumentChunk.query.filter_by(id=query.id).delete()
    logger.info(f'删除文本片段向量: chunk_id={query.id}')
    app.document_vector_store.delete_vector([query.id])
    return Resp.success(query.id)


@document_bp.delete('/delete', summary='删除文档', tags=[document_tag], responses={200: Resp[str]})
def delete_document(query: IdDTO):
    _validate_document_and_get(query.id)
    with app.db.auto_commit_db():
        logger.info(f'删除文档 doc_id={query.id}')
        BaDocument.query.filter_by(id=query.id).delete()
        chunks = BaDocumentChunk.query.filter_by(document_id=query.id).all()
        chunk_ids = [chunk.id for chunk in chunks]
        logger.info(f'删除文档的所有分片 doc_id={query.id}, 共{len(chunks)}个分片')
        BaDocumentChunk.query.filter_by(document_id=query.id).delete()
    app.document_vector_store.delete_vector(chunk_ids)
    return Resp.success(query.id)


def _validate_document_category_and_get(category_id: str) -> BaDocumentCategory:
    """校验文档分类id并返回文档分类信息"""
    category = BaDocumentCategory.query.get(category_id)
    if not category:
        raise BmosException(_(TRANSLATIONS['document_category_not_exist']))
    return category


def _validate_document_and_get(document_id: str) -> BaDocument:
    """校验文档id并返回文档信息"""
    doc = BaDocument.query.get(document_id)
    if not doc:
        raise BmosException(_(TRANSLATIONS['document_not_exist']))
    return doc


def _validate_chunk_and_get(chunk_id: str) -> BaDocumentChunk:
    """校验文档分片id并返回文档信息"""
    chunk = BaDocumentChunk.query.get(chunk_id)
    if not chunk:
        raise BmosException(_(TRANSLATIONS['document_chunk_not_exist']))
    return chunk


def validate_documents(document_ids: list[str]) -> list[BaDocument]:
    """批量校验文件是否存在"""
    if not document_ids:
        return []
    """判断是否含有重复的id"""
    if len(set(document_ids)) != len(document_ids):
        raise BmosException(_(TRANSLATIONS['document_duplicate_id']))
    """校验文档id并返回文档信息"""
    docs = BaDocument.query.filter(BaDocument.id.in_(document_ids)).all()
    if len(docs) != len(document_ids):
        raise BmosException(_(TRANSLATIONS['document_not_exist']))
    return docs


def _get_doc_chunks(form: DocumentSplitDTO) -> DocumentChunkInfo:
    from app.core.agent.knowledge.document.document import langchain_split_document
    """获取文档分段"""
    document_data = _validate_document_and_get(form.document_id)
    with NamedTemporaryFile('w+b') as tmp:
        app.minio_client.download_file_storage(document_data.source_url, tmp)
        tmp.seek(0)
        logger.info(f'文件下载成功: {document_data.source_url} => {tmp.name}')
        # 分割文件
        separators = ["\n\n", "\n", " ", "。"]
        if form.chunk_identifier:
            separators = form.chunk_identifier.split(' ')
        file_type = get_file_type(document_data.source_url)
        result = langchain_split_document(tmp,
                                          file_type,
                                          form.chunk_size,
                                          form.chunk_overlap,
                                          list(set(separators)),
                                          form.trip,
                                          form.clear_url
                                          )



        result.document_id = form.document_id
        return result


def __save_file_storage_to_document(document_url: str, name: str, serial: str, category_id: str,
                                    dept_ids: [str | int]) -> str:
    """
    将FileStorage保存到文档表
    :param document_url: 文档url
    :param name: 文档名称
    :param serial: 文档序列号
    :param category_id: 分类id
    :param dept_ids: 部门id
    :return: 文档id
    """

    with NamedTemporaryFile('w+b') as tmp:
        app.minio_client.download_file_storage(document_url, tmp)
        tmp.seek(0)

        doc = file_storage_to_ba_document(tmp, document_url)
        # 分类
        doc.category_id = category_id
        doc.serial = serial or generate_serial('DOC_')
        doc.name = name
        with app.db.auto_commit_db():
            if BaDocument.query.filter_by(serial=doc.serial).first():
                raise BmosException(_(TRANSLATIONS['document_id_exist']))
            if BaDocument.query.filter_by(name=doc.name).first():
                raise BmosException(_(TRANSLATIONS['document_name_exist']))
            app.db.session.add(doc)
            app.db.session.flush()
            save_resources_permission(ResourcesCreateDTO(resource_id=doc.id, dept_ids=dept_ids))
            return str(doc.id)


def __validate_file_name(file_name: str):
    """校验文件名 没有类型统一当作txt处理"""
    return f'{file_name}.txt' if not get_file_type(file_name) else file_name
