from flask import request
from flask_openapi3 import APIBlueprint, Tag

from app.app_init import app
from app.auth.auth_content import get_context_user
from app.auth.service import change_password, change_signature_password, get_user_by_login_name, load_user_by_token, login_user, logout_user, to_login_response
from app.constants.constants.auth_constants import ACCESS_TOKEN
from app.entities.auth_user import BaAuthUser
from app.exception.exception_handler import AuthException, BmosException
from app.models.auth import ChangePasswordRequest, LoginRequest, ParameterResponse, UserLoginResponse, UserUpdateRequest
from app.models.common.resp import Resp
from config import Config

auth_tag = Tag(name='本地鉴权接口')
platform_tag = Tag(name='兼容平台接口')

auth_bp = APIBlueprint('auth', __name__, url_prefix='/auth')
platform_user_bp = APIBlueprint('platform_user', __name__, url_prefix='/api/app/platform/user')
platform_common_bp = APIBlueprint('platform_common', __name__, url_prefix='/api/app/platform')
platform_parameter_bp = APIBlueprint('platform_parameter', __name__, url_prefix='/api/app/platform/business/parameter')


def _get_token() -> str:
    return request.headers.get(ACCESS_TOKEN) or request.headers.get('token') or ''


def _require_current_user() -> BaAuthUser:
    sys_user = get_context_user()
    if not sys_user or not sys_user.login_name:
        raise BmosException('未找到当前用户')
    user = get_user_by_login_name(sys_user.login_name)
    if not user:
        raise BmosException('用户不存在')
    return user


def _handle_login(body: LoginRequest):
    with app.db.auto_commit_db():
        user = login_user(app.redis_client, body.login_name, body.password)
    return Resp.success(user)


def _handle_logout():
    logout_user(app.redis_client, _get_token())
    return Resp.success()


def _handle_status():
    token = _get_token()
    user = load_user_by_token(app.redis_client, token)
    if not user or not user.login_name:
        raise AuthException()
    db_user = get_user_by_login_name(user.login_name)
    if not db_user:
        raise BmosException('用户不存在')
    return Resp.success(to_login_response(db_user, token))


def _handle_change_password(body: ChangePasswordRequest):
    user = _require_current_user()
    new_password = body.new_password or body.signature_password
    if not new_password:
        raise BmosException('新密码不能为空')
    with app.db.auto_commit_db():
        change_password(user, body.old_password, new_password)
    return Resp.success()


def _handle_change_signature_password(body: ChangePasswordRequest):
    user = _require_current_user()
    if not body.signature_password:
        raise BmosException('签名密码不能为空')
    with app.db.auto_commit_db():
        change_signature_password(user, body.login_password, body.signature_password)
    return Resp.success()


@auth_bp.post('/login', summary='本地登录', tags=[auth_tag], responses={200: Resp[UserLoginResponse]})
def auth_login(body: LoginRequest):
    return _handle_login(body)


@auth_bp.get('/status', summary='当前登录状态', tags=[auth_tag], responses={200: Resp[UserLoginResponse]})
def auth_status():
    return _handle_status()


@auth_bp.delete('/logout', summary='退出登录', tags=[auth_tag], responses={200: Resp})
def auth_logout():
    return _handle_logout()


@auth_bp.put('/change-password', summary='修改登录密码', tags=[auth_tag], responses={200: Resp})
def auth_change_password(body: ChangePasswordRequest):
    return _handle_change_password(body)


@auth_bp.get('/health', summary='健康检查', tags=[auth_tag], responses={200: Resp})
def auth_health():
    return Resp.success({'status': 'ok'})


@platform_user_bp.post('/login', summary='兼容旧前端登录接口', tags=[platform_tag], responses={200: Resp})
def platform_login(body: LoginRequest):
    return _handle_login(body)


@platform_user_bp.get('/status', summary='兼容旧前端状态接口', tags=[platform_tag], responses={200: Resp})
def platform_status():
    return _handle_status()


@platform_user_bp.delete('/logout', summary='兼容旧前端登出接口', tags=[platform_tag], responses={200: Resp})
def platform_logout():
    return _handle_logout()


@platform_user_bp.put('/changePassword', summary='兼容旧前端修改密码接口', tags=[platform_tag], responses={200: Resp})
def platform_change_password(body: ChangePasswordRequest):
    return _handle_change_password(body)


@platform_user_bp.put('/changeLoginUserPassword', summary='兼容旧前端修改登录密码接口', tags=[platform_tag], responses={200: Resp})
def platform_change_login_user_password(body: ChangePasswordRequest):
    return _handle_change_password(body)


@platform_user_bp.put('/changePwd', summary='兼容旧前端修改密码接口', tags=[platform_tag], responses={200: Resp})
def platform_change_pwd(body: ChangePasswordRequest):
    return _handle_change_password(body)


@platform_user_bp.post('/resetPassword', summary='兼容旧前端重置密码接口', tags=[platform_tag], responses={200: Resp})
def platform_reset_password(body: ChangePasswordRequest):
    login_name = body.login_name or (_require_current_user().login_name if get_context_user() else None)
    if not login_name:
        raise BmosException('登录名不能为空')
    user = get_user_by_login_name(login_name)
    if not user:
        raise BmosException('用户不存在')
    if not body.new_password:
        raise BmosException('新密码不能为空')
    with app.db.auto_commit_db():
        change_password(user, None, body.new_password)
    return Resp.success()


@platform_user_bp.put('/update', summary='兼容旧前端更新用户接口', tags=[platform_tag], responses={200: Resp})
def platform_update_user(body: UserUpdateRequest):
    return Resp.success(body.model_dump(by_alias=True))


@platform_common_bp.get('/i18n/config', summary='本地 i18n 配置', tags=[platform_tag], responses={200: Resp})
def platform_i18n():
    return Resp.success({})


@platform_common_bp.put('/signature/updateSignaturePassword', summary='本地签名密码接口', tags=[platform_tag], responses={200: Resp})
def platform_signature_password(body: ChangePasswordRequest):
    return _handle_change_signature_password(body)


@platform_parameter_bp.get('/detailByCode/<code>', summary='本地参数配置', tags=[platform_tag], responses={200: Resp[ParameterResponse]})
def platform_parameter_detail(code: str):
    value = Config.PARAMETERS.get(code, '')
    return Resp.success(ParameterResponse(code=code, value=value))
