from app.app_init import app
from app.auth.auth_content import SysUser
from app.constants.constants.redis_constants import USER_INFO_CACHE_TEMPLATE


def get_user_info(user_id: str) -> SysUser | None:
    """根据user_id获取用户"""
    if not user_id:
        return None
    try:
        user_obj_str = app.redis_client.get(USER_INFO_CACHE_TEMPLATE.format(user_id))
        if not user_obj_str:
            return None
        return SysUser.model_validate_json(user_obj_str.decode('utf-8'))
    except Exception as e:
        app.logger.error(e)
        return None

def get_user_name(user_id: str) -> str | None:
    """根据user_id获取用户"""
    if not user_id:
        return None
    user = get_user_info(user_id)
    if not user:
        return None
    return user.user_name
