# -*- coding: utf-8 -*-
# @Time    : 2025/4/16 21:18
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm

from datetime import datetime

from sqlalchemy import String, Text, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import Base, IdType, db


class BaConversation(db.Model, Base):
    """对话"""
    title: Mapped[str] = mapped_column(String, comment="会话标题")
    agent_id: Mapped[str] = mapped_column(IdType, comment="智能体id")
    user_id: Mapped[str] = mapped_column(IdType, comment="用户id", nullable=True)
    last_chat_time: Mapped[datetime] = mapped_column(DateTime, comment="上次聊天时间")
    user_delete_time: Mapped[datetime] = mapped_column(DateTime, comment="用户删除时间")

    def __init__(self, _id, title, agent_id, user_id, last_chat_time, user_delete_time = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.id = _id
        self.title = title
        self.agent_id = agent_id
        self.user_id = user_id
        self.last_chat_time = last_chat_time
        self.user_delete_time = user_delete_time


class BaQuestion(db.Model, Base):
    """问题"""
    conversation_id: Mapped[str] = mapped_column(IdType, comment="会话id")
    question_content: Mapped[str] = mapped_column(String, comment="问题")

    def __init__(self, conversation_id, question_content, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conversation_id = conversation_id
        self.question_content = question_content


class BaAnswer(db.Model, Base):
    """答案"""
    conversation_id: Mapped[str] = mapped_column(IdType, comment="会话id")
    question_id: Mapped[str] = mapped_column(IdType, comment="问题id")
    question: Mapped[str] = mapped_column(String, comment="问题")
    answer_content: Mapped[str] = mapped_column(Text, comment="答案")
    during: Mapped[float] = mapped_column(Float, comment="耗时")

    def __init__(self, _id, conversation_id, question_id, question, answer_content, during, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.id = _id
        self.conversation_id = conversation_id
        self.question_id = question_id
        self.question = question
        self.answer_content = answer_content
        self.during = during
