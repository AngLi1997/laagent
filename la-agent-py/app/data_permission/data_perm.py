from functools import wraps
from typing import List, Callable, TypeVar

from pydantic import BaseModel

from app.auth.auth_content import get_context_user
from app.entities.permission_resource import BaResources
from app.exception.exception_handler import BmosException
from app.models.agent import ListResponse
from app.models.common.page import PageResponse
from app.models.common.resp import Resp

T = TypeVar('T', bound=BaseModel)

def data_permission():
    """
    数据权限装饰器
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 0.管理员直接放行
            if is_admin():
                return func(*args, **kwargs)
            # 1. 获取当前用户部门权限
            user_dept_ids = _get_user_dept_ids()
            if not user_dept_ids:
                raise BmosException('当前用户无部门信息！')

            # 2. 执行原始查询
            result = func(*args, **kwargs)['data']

            # 3.获取允许的资源ID集合
            allowed_ids = {str(r.resource_id) for r in BaResources.query.filter(BaResources.dept_id.in_(user_dept_ids)).all()}

            # 4.处理分页响应
            if isinstance(result, PageResponse):
                return _handle_pagination(result, allowed_ids)

            # 5.处理下拉列表响应
            if isinstance(result, list):
                return _handle_list(result, allowed_ids)

            return result
        return wrapper
    return decorator



def _get_user_dept_ids() -> List[int]:
    """获取用户所属部门ID列表"""
    try:
        from app.feign.dept_feign import DeptFeign
        resp = DeptFeign().mine_dept_ids()
    except Exception:
        return []
    if not resp:
        return []
    return resp.data

def _handle_pagination(response: PageResponse[T], allowed_ids: set):
    """处理分页响应"""
    # 过滤数据
    filtered_data = [item for item in response.data if item.id in allowed_ids]
    response.data = filtered_data
    response.total = len(filtered_data)
    response.total_page = (len(filtered_data) // response.page_size +
                   (1 if len(filtered_data) % response.page_size else 0))
    # 重新计算分页信息
    return Resp.success(response)

def _handle_list(response: list, allowed_ids: set):
    filtered_data = [item for item in response if item.id in allowed_ids]
    return Resp.success(filtered_data)

def is_admin() -> bool:
    return get_context_user().user_id == '1'
