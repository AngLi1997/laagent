# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 10:57
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from datetime import datetime

from sqlalchemy import DateTime, ARRAY, String
from sqlalchemy.orm import Mapped, mapped_column

from app.constants.enums.tag_enums import TagType
from app.database.database_settings import Base, IdType, db


class BaConversationTag(db.Model, Base):
    """标记记录"""
    conversation_id: Mapped[str] = mapped_column(IdType, comment='会话id')
    question_id: Mapped[str] = mapped_column(IdType, comment='问题id')
    answer_id: Mapped[str] = mapped_column(IdType, comment='回答id')
    tag_user_id: Mapped[str] = mapped_column(IdType, comment='标记用户id')
    tag_type: Mapped[TagType | None] = mapped_column(comment='标记', nullable=True)
    tag_time: Mapped[datetime] = mapped_column(DateTime, comment='标记时间', nullable=True)
    is_admin: Mapped[bool] = mapped_column(comment='是否为管理员标记', nullable=True)
    content: Mapped[str | None] = mapped_column(comment='反馈内容', nullable=True)
    content_type: Mapped[list[str] | None] = mapped_column(ARRAY(String), comment='反馈内容分类', default=[])
    send_time: Mapped[datetime | None] = mapped_column(DateTime, comment='下发时间', nullable=True)
    send_user_id: Mapped[str | None] = mapped_column(IdType, comment='下发人id', nullable=True)

    def __init__(self, conversation_id: str = None, question_id: str = None, answer_id: str = None,
                 tag_user_id: str = None, tag_type: TagType = None, tag_time: datetime = None, is_admin: bool = None,
                 content: str = None, content_type: list[str] = None, send_time: datetime = None,
                 send_user_id: str = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conversation_id = conversation_id
        self.question_id = question_id
        self.answer_id = answer_id
        self.tag_user_id = tag_user_id
        self.tag_type = tag_type
        self.tag_time = tag_time
        self.is_admin = is_admin
        self.content = content
        self.content_type = content_type
        self.send_time = send_time
        self.send_user_id = send_user_id
