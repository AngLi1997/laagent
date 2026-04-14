# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 16:24
# @Author  : liang
# @FileName: app_init.py
# @Software: PyCharm

import redis
from flask.sansio.blueprints import T_before_request
from flask_babel import Babel
from flask_cors import CORS
from flask_openapi3 import OpenAPI, Info
from loguru import logger

from app.auth.request_filter import init_request_filter
from app.auth.service import bootstrap_auth_users
from app.babel.bable import get_locale
from app.blueprints.register_all import register_all_blueprints
from app.core.agent.vector.document_vector import BmosDocumentVectorStore
from app.core.agent.vector.question_range_vector import BmosQuestionRageVectorStore
from app.database.database_settings import db
from app.exception.exception_handler import init_exception_handler
from app.minio import DisabledMinioClient, MinioClient
from app.services.menu_service import bootstrap_menus
from app.sensitive_word.sensitive_word_context import load_sensitive_words
from app.serialize import init_json_provider
from config import Config

"""初始化应用"""


class BmosFlask(OpenAPI):


    def __init__(self, import_name, *args, **kwargs):

        super().__init__(import_name, *args, **kwargs)

        # 加载通用配置
        self.config.from_object(Config)
        logger.info('加载通用配置成功')

        # 设置跨域
        CORS(self)
        logger.info('设置跨域成功')

        # 数据库初始化
        self.db = db
        self.db.init_app(self)
        logger.info('数据库初始化成功')

        # redis初始化
        self.redis_client = redis.from_url(Config.REDIS_URL)
        logger.info('redis初始化成功')

        # minio初始化
        if Config.MINIO_ENABLED:
            self.minio_client = MinioClient(
                endpoint=Config.MINIO_ENDPOINT,
                access_key=Config.MINIO_ACCESS_KEY,
                secret_key=Config.MINIO_SECRET_KEY,
                bucket_name=Config.MINIO_BUCKET_NAME,
                secure=False,
            )
            logger.info('minio初始化成功')
        else:
            self.minio_client = DisabledMinioClient()
            logger.info('minio已禁用，使用本地降级客户端')

        if Config.VECTOR_STORE_ENABLED:
            self.document_vector_store = BmosDocumentVectorStore(collection_name='la-agent-py_vector')
            logger.info('知识库向量数据库初始化成功')
            self.question_range_store = BmosQuestionRageVectorStore(collection_name='la-agent-py_question_range_vector')
            logger.info('问题靶场向量数据库初始化成功')
        else:
            self.document_vector_store = None
            self.question_range_store = None
            logger.info('向量存储已禁用')

    def before_requests(self, funcs: list[T_before_request]):
        for func in funcs:
            self.before_request(func)

# app & swagger
app = BmosFlask(__name__, info=Info(title='Bmos Agent', version='1.0.0'))

babel = Babel()
babel.init_app(app,locale_selector=get_locale)

# 注册拦截器
init_request_filter()

# 注册blueprints
register_all_blueprints(app)

# 注册全局异常捕获器
init_exception_handler(app)

# 全局序列化
init_json_provider(app)

with app.app_context():
    if Config.AUTO_CREATE_TABLES:
        app.db.create_all()
        bootstrap_auth_users(app.db.session)
        bootstrap_menus(app.db.session)
        app.db.session.commit()
        logger.info('数据库表与初始账号检查完成')

load_sensitive_words()
