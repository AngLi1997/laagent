# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 10:37
# @Author  : liang
# @FileName: chatlog.py
# @Software: PyCharm
from datetime import datetime

from pydantic import BaseModel, Field

from app.database.database_settings import dynamic_str_field


class UserFeedbackDTO(BaseModel):
    """对话消息体"""
    msg: str | int = dynamic_str_field(description='反馈消息')
    conversation_id: str | int | None = dynamic_str_field(None, description='会话id')


class FeedbackReplyHistory(BaseModel):
    id: str | int = dynamic_str_field(description='id')
    reply_msg: str | int = dynamic_str_field(description='回复消息')
    reply_user: str | int = dynamic_str_field(description='回复人')
    reply_time: datetime = Field(description='回复时间')

class FeedbackHistory(BaseModel):
    id: str | int = dynamic_str_field(description='id')
    msg: str | int = dynamic_str_field(description='反馈消息')
    feedback_time: datetime = Field(description='反馈时间')
    replies: list[FeedbackReplyHistory] = Field([], description='回复列表')