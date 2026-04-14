# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 15:09
# @Author  : liang
# @FileName: request_filter.py
# @Software: PyCharm
import re

from flask import request

from app.auth.auth_content import set_context_user
from app.auth.service import load_user_by_token
from app.constants.constants.auth_constants import ACCESS_TOKEN
from config import Config


def before_user_request():

    from app.app_init import app
    from app.exception.exception_handler import AuthException

    path = request.path
    for ignore_url in Config.IGNORE_URL:
        if re.match(ignore_url, path):
            return
    token = request.headers.get(ACCESS_TOKEN)
    if not token:
        if not Config.ALLOW_ANONYMITY:
            raise AuthException()
        else:
            return
    user = load_user_by_token(app.redis_client, token)
    if user is None:
        raise AuthException()
    set_context_user(user)


def init_request_filter():
    from app.app_init import app
    app.before_requests([before_user_request])
