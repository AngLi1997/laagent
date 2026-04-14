# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 16:42
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from flask_openapi3 import FileStorage
from pydantic import Field, BaseModel

from app.constants.enums.tag_enums import TagType
from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class ChatSSEQuery(BaseModel):
    """对话消息体"""
    conversation_id: str | int | None = dynamic_str_field(None, description='对话id')
    agent_id: str | int = dynamic_str_field(description='智能体')
    input: str | int = dynamic_str_field(description='内容')
    search_on_line: bool | None = Field(False, description='是否开启联网搜索')
    input_files: list[FileStorage] | None = Field(None, description='文件列表')


class ChatHistoryPageQuery(PageRequest):
    conversation_title: str | int | None = dynamic_str_field(None, description='会话标题')


class ChatHistoryPageResponse(BaseModel):
    conversation_id: str | int = dynamic_str_field(description='会话id')
    conversation_title: str | int = dynamic_str_field(description='会话标题')
    agent_name: str | int | None = dynamic_str_field(None, description='智能体名称')
    agent_avatar: str | int | None = dynamic_str_field(description='智能体头像')
    last_chat_time: str = dynamic_str_field(description='上次聊天时间')


class ChatHistoryMessageView(BaseModel):
    answer_id: str | int = dynamic_str_field(description='答案id')
    question_id: str | int = dynamic_str_field(description='问题id')
    question: str | int = dynamic_str_field(description='问题')
    answer_messages_list: list[dict] | None = Field(None, description='响应消息列表')
    user_tag_type: TagType | None = Field(None, description='用户标记类型')
    admin_tag_type: TagType | None = Field(None, description='管理员标记类型')


class ChatHistoryInfo(BaseModel):
    conversation_id: str | int = dynamic_str_field(description='会话id')
    conversation_title: str | int = dynamic_str_field(description='会话标题')
    agent_id: str | int | None = dynamic_str_field(None, description='智能体id')
    agent_name: str | int | None = dynamic_str_field(None, description='智能体名称')
    agent_avatar: str | int | None = dynamic_str_field(None, description='智能体头像')
    last_chat_time: str = dynamic_str_field(description='上次聊天时间')
    chats: list[ChatHistoryMessageView] = Field(None, description='聊天记录')
    user_avatar: str | int | None = dynamic_str_field(None, description='用户头像')


class ChatLatestAgent(BaseModel):
    agent_id: str | int = dynamic_str_field(description='会话id')
    agent_name: str | int | None = dynamic_str_field(None, description='智能体名称')
    agent_avatar: str | int | None = dynamic_str_field(None, description='智能体头像')


class EditConversationQuery(BaseModel):
    conversation_id: str | int = dynamic_str_field(description='会话id')
    conversation_title: str | int = dynamic_str_field(description='会话标题')
