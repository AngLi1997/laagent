# -*- coding: utf-8 -*-
# @Time    : 2025/4/2 23:09
# @Author  : liang
# @FileName: exception_handler.py
# @Software: PyCharm

"""异常处理器"""

from flask import make_response
from flask_openapi3 import OpenAPI
from loguru import logger
from pydantic import ValidationError

from app.models.common.resp import Resp


class BmosException(Exception):
    def __init__(self, message: str = '业务失败'):
        self.message = message

class AuthException(Exception):
    def __init__(self):
        self.message = '未授权'

class TerminalException(Exception):
    def __init__(self, message: str = '终止对话'):
        self.message = message

def init_exception_handler(app: OpenAPI):

    """初始化异常处理器"""

    @app.errorhandler(TypeError)
    def handle_type_error(error: TypeError):
        logger.exception(error)
        return make_response(Resp.fail(str(error)))

    @app.errorhandler(BmosException)
    def handle_bmos_exception(error: BmosException):
        logger.error(error)
        return make_response(Resp.fail(error.message))

    @app.errorhandler(AuthException)
    def handle_auth_exception(error: AuthException):
        logger.error(error)
        return make_response(Resp.auth_fail(error.message))

    @app.errorhandler(Exception)
    def handle_base_exception(error):
        logger.exception(f'{type(error)} {error}')
        return make_response(Resp.error('系统错误', str(error)))

    def _validation_except_handler(error: ValidationError):
        logger.info(f'{error}')
        """处理校验异常"""
        return make_response(Resp.fail('参数错误', [f'[{e.get("loc", None)[0]}] {e.get("msg", None)}' for e in error.errors()]))
    app.validation_error_callback = _validation_except_handler
    logger.info('异常捕获器初始化成功')

def get_exception_trace(e: Exception):
    if e:
        return e.args
