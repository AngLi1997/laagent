# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:33
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm
"""blueprints"""
from flask_openapi3 import APIBlueprint, OpenAPI
from loguru import logger


def register_all_blueprints(app: OpenAPI):

    from app.blueprints.agent_plueprint import agents_bp
    from app.blueprints.auth_blueprint import auth_bp, platform_common_bp, platform_parameter_bp, platform_user_bp
    from app.blueprints.chat_blueprint import chat_bp
    from app.blueprints.chat_histories_blueprint import chat_log_bp
    from app.blueprints.conversation_blueprint import conversation_bp
    from app.blueprints.document_blueprint import document_bp
    from app.blueprints.feedback_blueprint import feedback_bp
    from app.blueprints.file_blueprint import files_bp
    from app.blueprints.knowledge_blueprint import knowledge_base_bp
    from app.blueprints.llm_blueprint import models_bp
    from app.blueprints.menu_blueprint import platform_menu_bp
    from app.blueprints.permission_resource_blueprint import resource_bp
    from app.blueprints.question_range_blueprint import questions_bp
    from app.blueprints.sensitive_blueprint import chat_review_bp
    from app.blueprints.tag_blueprint import tag_bp
    from app.blueprints.tool_blueprint import tools_bp
    from app.blueprints.user_settings_blueprint import configs_bp

    """注册blueprints"""
    # 全局路由
    prefix = APIBlueprint('global', __name__, url_prefix='/api/app/agent')

    prefix.register_api(chat_bp)
    prefix.register_api(document_bp)
    prefix.register_api(models_bp)
    prefix.register_api(tools_bp)
    prefix.register_api(questions_bp)
    prefix.register_api(chat_log_bp)
    prefix.register_api(chat_review_bp)
    prefix.register_api(knowledge_base_bp)
    prefix.register_api(resource_bp)
    prefix.register_api(tag_bp)
    prefix.register_api(agents_bp)
    prefix.register_api(conversation_bp)
    prefix.register_api(files_bp)
    prefix.register_api(configs_bp)
    prefix.register_api(feedback_bp)
    prefix.register_api(auth_bp)

    app.register_api(prefix)
    app.register_api(platform_user_bp)
    app.register_api(platform_common_bp)
    app.register_api(platform_parameter_bp)
    app.register_api(platform_menu_bp)

    logger.info('blueprint初始化成功')
