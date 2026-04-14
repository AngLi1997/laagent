# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 10:16
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from datetime import datetime

from pydantic import BaseModel, Field

from app.constants.enums.tag_enums import TagType
from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class ConversationPageQuery(PageRequest):
    user_id: str | int | None = dynamic_str_field(None, description='用户id')

class LikeOrDislike(BaseModel):
    conversation_id: str | int = dynamic_str_field(description='会话id')
    question_id: str | int = dynamic_str_field(description='问题id')
    answer_id: str | int = dynamic_str_field(description='问题id')
    tag_type: TagType | None = Field(TagType.LIKE, description='标签类型(赞/踩)')
    content_type: list[str] | None = Field(None, description='反馈内容分类')
    content: str | None = Field(None, description='反馈内容')

class ConversationPageResult(BaseModel):

    conversation_id: str | int = dynamic_str_field(description='会话id')
    conversation_name: str = Field(description='会话名称')
    user_name: str = Field(description='用户名称')
    agent_name: str = Field(description='智能体名称')

    user_tag_like_count: int | None = Field(None, description='用户标签/点赞')
    user_tag_dislike_count: int | None = Field(None, description='用户标签/点踩')
    admin_tag_like_count: int | None = Field(None, description='管理员标签/点赞')
    admin_tag_dislike_count: int | None = Field(None, description='管理员标签/点踩')
    latest_tag_time: datetime | None = Field(None, description='最新标记时间')
