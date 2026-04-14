# -*- coding: utf-8 -*-
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import Base, db


class BaGraphLlmMessages(db.Model, Base):

    __tablename__ = 'ba_graph_llm_messages'
    __table_args__ = {'extend_existing': True, 'comment': '智能体图LLM节点历史消息'}

    node_id: Mapped[str] = mapped_column(String, comment='节点id', nullable=False)
    chat_id: Mapped[str] = mapped_column(String, comment='会话线程id', nullable=False)
    llm_message: Mapped[str] = mapped_column(String, comment='llm回答的消息', nullable=False)
    type: Mapped[str] = mapped_column(String, comment='消息类型 user/assistant', nullable=False)
    sort: Mapped[int] = mapped_column(BigInteger, comment='排序', nullable=False)

    def __init__(self, node_id, chat_id, llm_message, type, sort):
        super().__init__()
        self.node_id = node_id
        self.chat_id = chat_id
        self.llm_message = llm_message
        self.type = type
        self.sort = sort

    def __repr__(self):
        return (f"<BaGraphLlmMessages(node_id={self.node_id}, chat_id={self.chat_id}, llm_message={self.llm_message}, "
                f"type={self.type}, sort={self.sort})>")
