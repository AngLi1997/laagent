# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 12:45
# @Author  : liang
# @FileName: agent_plueprint.py.py
# @Software: PyCharm
from datetime import datetime

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint

from app.app_init import app
from app.auth.auth_content import get_context_user_id
from app.blueprints.permission_resource_blueprint import save_resources_permission
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.common_enum import EnableStatus
from app.core.agent.flow.agent_context import load_json_config
from app.core.agent.flow.agent_pool import agent_pool
from app.data_permission.data_perm import data_permission
from app.entities.agent import BaAgentCategory, BaAgent
from app.entities.knowledge_base import BaKnowledgeBase
from app.entities.llm import BaLLM
from app.exception.exception_handler import BmosException
from app.models.agent import AgentCategoryRequest, AgentCategoryQueryResponse, AgentQueryRequest, \
    AgentQueryResponse, ListResponse, LlmListResponse, AgentListResponse, QueryId, AgentRequest, AgentStatusRequest, \
    ToolListResponse
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.permission_resource import ResourcesCreateDTO
from app.utils import user_util
from app.utils.tree_util import build_tree

agents_tag = Tag(name='智能体管理接口')
agents_bp = APIBlueprint('agents', __name__, url_prefix='/agents')


@agents_bp.post('/category/create', summary="新增分类", tags=[agents_tag], responses={200: Resp})
def create_agent_category(body: AgentCategoryRequest):
    db_agent_category = BaAgentCategory.query.filter_by(name=body.name).first()
    if db_agent_category is not None:
        return Resp.error(_(TRANSLATIONS['category_exist']))

    app.db.session.add(BaAgentCategory(name=body.name, parent_id=body.parent_id))
    app.db.session.commit()
    return Resp.success()


@agents_bp.get('/category/tree', summary="查询分类树", tags=[agents_tag],
               responses={200: Resp[AgentCategoryQueryResponse]})
def category_tree():
    c_list = [AgentCategoryQueryResponse(id=c.id, name=c.name, parent_id=c.parent_id, children=[]) for c in
              BaAgentCategory.query.all()]
    c_tree = build_tree(c_list)
    return Resp.success(c_tree)


@agents_bp.delete('/category/remove', summary="删除分类", tags=[agents_tag], responses={200: Resp})
def remove_category(query: IdDTO):
    all_category = BaAgentCategory.query.filter_by(parent_id=query.id).all()
    if len(all_category) > 0:
        # 当前分类有子分类
        return Resp.error(_(TRANSLATIONS['category_has_child']))
    agent = BaAgent.query.filter_by(category_id=query.id).first()
    if agent is not None:
        # 当前分类下有智能体
        return Resp.error(_(TRANSLATIONS['category_has_agent']))
    with app.db.auto_commit_db():
        BaAgentCategory.query.filter_by(id=query.id).delete()
    return Resp.success()


@agents_bp.put('/category/update', summary="编辑分类", tags=[agents_tag], responses={200: Resp})
def update_category(body: AgentCategoryRequest):
    db_agent_category = BaAgentCategory.query.filter_by(name=body.name).first()
    if db_agent_category is not None:
        return Resp.error(_(TRANSLATIONS['category_exist']))
    with app.db.auto_commit_db():
        BaAgentCategory.query.filter_by(id=body.id).update({"name": body.name})
    return Resp.success()


@agents_bp.post('/page', summary="分页查询分类下的智能体", tags=[agents_tag], responses={200: Resp})
@data_permission()
def agent_page(body: AgentQueryRequest):
    page = (BaAgent.query
            .order_by(BaAgent.status.asc())
            .order_by(BaAgent.update_time.desc())
            .add_entity(BaAgentCategory)
            .join(BaAgentCategory, BaAgentCategory.id == BaAgent.category_id, isouter=True))
    if body.category_id:
        ids = [c.id for c in BaAgentCategory.get_all_children(parent_id=str(body.category_id))]
        page = page.filter(BaAgent.category_id.in_(ids))
    if body.name:
        page = page.filter(BaAgent.name.like(f"%{body.name}%"))

    page = page.paginate(
        page=body.page_num,
        per_page=body.page_size,
        error_out=False  # 页码超出范围不报错，返回空结果
    )

    page.items = [
        AgentQueryResponse(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            category_id=category.id,
            update_time=agent.update_time,
            update_user=user_util.get_user_name(agent.update_user),
            status=agent.status,
            category_name=category.name
        )
        for agent, category in page.items
    ]
    return Resp.success(PageResponse(page))


@agents_bp.get("/list", summary="智能体下拉列表", tags=[agents_tag], responses={200: Resp[AgentListResponse]})
@data_permission()
def agent_list(query: QueryId):
    page = BaAgent.query
    if query.id:
        page = page.filter(BaAgent.id == query.id)
    else:
        page = page.filter(BaAgent.status == EnableStatus.ENABLE)

    return Resp.success([AgentListResponse(id=a.id, name=a.name, icon_url=a.icon_url, description=a.description,
                                           args=a.args, category_id=str(a.category_id)) for a in page.all()])


@agents_bp.get("/kb/list", summary="知识库下拉列表", tags=[agents_tag], responses={200: Resp[ListResponse]})
@data_permission()
def knowledge_base_list():
    return Resp.success([ListResponse(id=a.id, name=a.name) for a in BaKnowledgeBase.query.all()])


@agents_bp.get("/llm/list", summary="大模型下拉列表", tags=[agents_tag], responses={200: Resp[LlmListResponse]})
@data_permission()
def llm_list():
    return Resp.success([LlmListResponse(id=a.id, name=a.name, args=a.temperature) for a in BaLLM.query.all()])


@agents_bp.get("/tool/list", summary="工具下拉列表", tags=[agents_tag], responses={200: Resp[ToolListResponse]})
@data_permission()
def tool_list():
    from app.entities.tool import BaTool
    return Resp.success([ToolListResponse(id=a.id, name=a.name, type=a.type, mcp_json=a.attribute) for a in BaTool.query.all()])


@agents_bp.post("/create", summary="新增智能体", tags=[agents_tag], responses={200: Resp})
def agent_create(body: AgentRequest):
    if BaAgent.query.filter_by(name=body.name).first():
        return Resp.error(_(TRANSLATIONS['name_exist']))

    # 校验配置
    load_json_config(body.args)

    with app.db.auto_commit_db():
        ba_agent = BaAgent(name=body.name,
                           category_id=body.category_id,
                           description=body.description,
                           status=EnableStatus.ENABLE,
                           argument=body.args,
                           icon_url=body.icon_url if body.icon_url else app.minio_client.get_random_default_image())
        app.db.session.add(ba_agent)
        app.db.session.flush()

    save_resources_permission(ResourcesCreateDTO(dept_ids=body.dept_ids, resource_id=ba_agent.id))
    return Resp.success(ba_agent.id)


@agents_bp.put("/update", summary="编辑智能体", tags=[agents_tag], responses={200: Resp})
def update_agent(body: AgentRequest):
    agent = _validate_agent_exist(body.id)
    if BaAgent.query.filter(BaAgent.name == body.name, BaAgent.id != body.id).first():
        raise BmosException(_(TRANSLATIONS['agent_name_exist']))
    load_json_config(body.args)
    with app.db.auto_commit_db():
        BaAgent.query.filter_by(id=body.id).update(
            {"name": body.name, "description": body.description, "category_id": body.category_id, "args": body.args,
             "icon_url": body.icon_url,"update_user":get_context_user_id(),"update_time":datetime.now()})
        from app.core.agent.flow.agent_pool import agent_pool
        agent_pool.remove_agent_graph(agent.id)

    return Resp.success()


@agents_bp.delete("/remove", summary="删除智能体", tags=[agents_tag], responses={200: Resp})
def remove_agent(body: QueryId):
    agent = _validate_agent_exist(body.id)

    if EnableStatus.ENABLE == agent.status:
        raise BmosException("删除前需先停用智能体！")

    from app.core.agent.flow.agent_pool import agent_pool
    agent_pool.remove_agent_graph(agent.id)

    app.db.session.delete(agent)
    app.db.session.commit()
    return Resp.success()


@agents_bp.put('/status', summary='启/停智能体', tags=[agents_tag], responses={200: Resp[str]})
def update_agent_status(body: AgentStatusRequest):
    ba_agent = _validate_agent_exist(body.id)
    if body.status == "enable" and ba_agent.status == EnableStatus.ENABLE:
        raise BmosException("智能体已启用")
    if body.status == "disable" and ba_agent.status == EnableStatus.DISABLE:
        raise BmosException("智能体已停用")

    new_status = EnableStatus.ENABLE if body.status == "enable" else EnableStatus.DISABLE
    # 清空智能体缓存
    agent_pool.remove_agent_graph(body.id)
    with app.db.auto_commit_db():
        BaAgent.query.filter_by(id=body.id).update({'status': new_status,"update_user":get_context_user_id(),"update_time":datetime.now()})
        return Resp.success(body.id)


def _validate_agent_exist(id: int):
    agent = BaAgent.query.get(id)
    if not agent:
        raise BmosException(_(TRANSLATIONS['agent_not_exist']))
    return agent
