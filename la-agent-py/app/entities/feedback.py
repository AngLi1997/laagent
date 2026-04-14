# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 10:41
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import Base, IdType, db


class BaFeedbackReply(db.Model, Base):
    """用户反馈问题回复"""
    feedback_id: Mapped[str] = mapped_column(IdType, comment="反馈id")
    reply_msg: Mapped[str] = mapped_column(String, comment="反馈回复消息")
    reply_user_id: Mapped[str] = mapped_column(IdType, comment="回复用户id")


class BaFeedback(db.Model, Base):
    """用户反馈问题"""
    msg: Mapped[str] = mapped_column(String, comment="反馈消息")
    user_id: Mapped[str] = mapped_column(String, comment="反馈用户id")
    conversation_id: Mapped[str] = mapped_column(IdType, comment="会话id", nullable=True)
