from __future__ import annotations

import hashlib
import hmac
import secrets
from typing import Iterable

from loguru import logger

from app.auth.auth_content import SysUser
from app.constants.constants.redis_constants import USER_INFO_CACHE_TEMPLATE, USER_TOKEN_ID_CACHE_TEMPLATE
from app.entities.auth_user import BaAuthUser
from app.exception.exception_handler import BmosException
from app.models.auth import UserLoginResponse
from config import Config


PBKDF2_PREFIX = 'pbkdf2_sha256'
PBKDF2_ITERATIONS = 600000


def hash_password(password: str, *, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), PBKDF2_ITERATIONS).hex()
    return f'{PBKDF2_PREFIX}${PBKDF2_ITERATIONS}${salt}${digest}'


def verify_password(password: str, password_hash: str) -> bool:
    try:
        prefix, iteration_str, salt, digest = password_hash.split('$', 3)
        if prefix != PBKDF2_PREFIX:
            return False
        expected = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), int(iteration_str)).hex()
        return hmac.compare_digest(expected, digest)
    except ValueError:
        logger.warning('密码哈希格式非法')
        return False


def to_sys_user(user: BaAuthUser, token: str | None = None) -> SysUser:
    return SysUser(
        user_id=user.id,
        user_name=user.user_name,
        login_name=user.login_name,
        active_status=user.active_status,
        state=user.state,
        token=token,
    )


def to_login_response(user: BaAuthUser, token: str) -> UserLoginResponse:
    return UserLoginResponse(
        userId=user.id,
        userName=user.user_name,
        loginName=user.login_name,
        token=token,
        activeStatus=user.active_status,
        state=user.state,
        remindExpire=False,
    )


def get_user_by_login_name(login_name: str) -> BaAuthUser | None:
    return BaAuthUser.query.filter_by(login_name=login_name).first()


def login_user(redis_client, login_name: str, password: str) -> UserLoginResponse:
    user = get_user_by_login_name(login_name)
    if not user or not verify_password(password, user.password_hash):
        raise BmosException('用户名或密码错误')
    if user.state != 1:
        raise BmosException('用户已停用')

    token = secrets.token_urlsafe(32)
    sys_user = to_sys_user(user, token)
    cache_user_session(redis_client, sys_user)
    return to_login_response(user, token)


def cache_user_session(redis_client, user: SysUser):
    if not user.token or not user.user_id:
        raise BmosException('用户会话信息不完整')
    ttl = Config.AUTH_TOKEN_TTL_SECONDS
    payload = user.model_dump_json(by_alias=True)
    redis_client.setex(USER_TOKEN_ID_CACHE_TEMPLATE.format(user.token), ttl, user.user_id)
    redis_client.setex(USER_INFO_CACHE_TEMPLATE.format(user.user_id), ttl, payload)


def load_user_by_token(redis_client, token: str) -> SysUser | None:
    if not token:
        return None
    user_id = redis_client.get(USER_TOKEN_ID_CACHE_TEMPLATE.format(token))
    if not user_id:
        return None
    user_payload = redis_client.get(USER_INFO_CACHE_TEMPLATE.format(user_id.decode('utf-8')))
    if not user_payload:
        return None
    user = SysUser.model_validate_json(user_payload.decode('utf-8'))
    user.token = token
    return user


def logout_user(redis_client, token: str):
    user = load_user_by_token(redis_client, token)
    redis_client.delete(USER_TOKEN_ID_CACHE_TEMPLATE.format(token))
    if user and user.user_id:
        redis_client.delete(USER_INFO_CACHE_TEMPLATE.format(user.user_id))


def change_password(user: BaAuthUser, old_password: str | None, new_password: str):
    if old_password and not verify_password(old_password, user.password_hash):
        raise BmosException('当前密码不正确')
    user.password_hash = hash_password(new_password)


def change_signature_password(user: BaAuthUser, login_password: str | None, signature_password: str):
    if login_password and not verify_password(login_password, user.password_hash):
        raise BmosException('登录密码不正确')
    user.signature_password_hash = hash_password(signature_password)


def bootstrap_auth_users(db_session):
    admin = get_user_by_login_name('admin')
    if admin:
        return
    db_session.add(BaAuthUser(
        id='1',
        user_name='管理员',
        login_name='admin',
        password_hash='pbkdf2_sha256$600000$bmos_admin_salt$416173b08da9c3755bff9bafb1db591b25ef2c69eb6708501b9cbddb8b754598',
        active_status=1,
        state=1,
    ))


def seed_users(db_session, users: Iterable[BaAuthUser]):
    for user in users:
        db_session.add(user)
