# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 14:30
# @Author  : liang
# @FileName: auth_content.py
# @Software: PyCharm
from typing import Optional

from flask import g
from pydantic import BaseModel, Field
from pydantic.v1.utils import to_lower_camel

from config import Config


class  SysUser(BaseModel):
    user_id: Optional[str] = Field(default=None, description="用户id")
    user_name: Optional[str] = Field(default=None, description="用户名称")
    login_name: Optional[str] = Field(default=None, description="登录名称")
    password: Optional[str] = Field(default=None, description="密码")
    active_status: Optional[int] = Field(default=None, description="激活状态")
    state: Optional[int] = Field(default=None, description="状态")
    token: Optional[str] = Field(default=None, description="token")

    class Config:
        populate_by_name = True
        alias_generator = to_lower_camel
def set_context_user(user: SysUser):
    setattr(g, 'login_user', user)

def get_context_user() -> SysUser | None:
    if Config.ALLOW_ANONYMITY:
        return SysUser(user_id='1', user_name='管理员', login_name='admin', password='admin', active_status=1, state=1, token='admin')
    return getattr(g, 'login_user', None)

def get_context_user_id() -> str | None:
    return get_context_user().user_id if get_context_user() else None

def get_context_user_name() -> str | None:
    return get_context_user().user_name if get_context_user() else None