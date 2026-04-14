from flask_openapi3 import APIBlueprint, Tag

from app.models.common.resp import Resp
from app.models.menu import MenuQueryRequest, MenuNode
from app.services.menu_service import query_menu_tree

platform_menu_tag = Tag(name='兼容平台菜单接口')

platform_menu_bp = APIBlueprint('platform_menu', __name__, url_prefix='/api/app/platform/menu')


@platform_menu_bp.get('/auth/tree', summary='兼容旧前端菜单树接口', tags=[platform_menu_tag], responses={200: Resp[list[MenuNode]]})
def platform_menu_auth_tree(query: MenuQueryRequest):
    return Resp.success(query_menu_tree(
        root_menu_code=query.root_menu_code,
        contains_func=query.contains_func,
        terminal_type=query.terminal_type,
    ))


@platform_menu_bp.get('/auth/all', summary='兼容旧前端菜单全量接口', tags=[platform_menu_tag], responses={200: Resp[list[MenuNode]]})
def platform_menu_auth_all(query: MenuQueryRequest):
    return Resp.success(query_menu_tree(
        root_menu_code=query.root_menu_code,
        contains_func=query.contains_func,
        terminal_type=query.terminal_type,
    ))


@platform_menu_bp.get('/admin/tree', summary='兼容旧前端管理员菜单树接口', tags=[platform_menu_tag], responses={200: Resp[list[MenuNode]]})
def platform_menu_admin_tree(query: MenuQueryRequest):
    return Resp.success(query_menu_tree(
        root_menu_code=query.root_menu_code,
        contains_func=True,
        terminal_type=query.terminal_type,
    ))


@platform_menu_bp.get('/auth/menu/tree', summary='兼容旧前端菜单授权树接口', tags=[platform_menu_tag], responses={200: Resp[list[MenuNode]]})
def platform_menu_auth_menu_tree(query: MenuQueryRequest):
    return Resp.success(query_menu_tree(
        root_menu_code=query.root_menu_code,
        contains_func=query.contains_func,
        terminal_type=query.terminal_type,
    ))
