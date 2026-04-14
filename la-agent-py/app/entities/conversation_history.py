# -*- coding: utf-8 -*-
# @Time    : 2025/4/21 10:32
# @Author  : liang
# @FileName: conversation_history.py
# @Software: PyCharm

from sqlalchemy.orm import mapped_column, Mapped

from app.database.database_settings import Base, IdType, db


class BaConversation(db.Model, Base):
    """对话"""
    conversation_id: Mapped[str] = mapped_column(IdType, comment='对话id')
    agent_id: Mapped[str] = mapped_column(IdType, comment="智能体id")
    user_id: Mapped[str] = mapped_column(IdType, comment="用户id", nullable=True)

    def __init__(self, conversation_id, first_question, agent_id, user_id, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conversation_id = conversation_id
        self.first_question = first_question
        self.agent_id = agent_id
        self.user_id = user_id
