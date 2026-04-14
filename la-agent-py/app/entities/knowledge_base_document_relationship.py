# -*- coding: utf-8 -*-
# @Time    : 2025/4/2 16:09
# @Author  : liang
# @FileName: naocs.py.py
# @Software: PyCharm
"""知识库管理"""

from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import IdType, Base, db


class BaKnowledgeBaseDocumentRelationship(db.Model, Base):
    """知识库关联表"""

    knowledge_base_id: Mapped[str] = mapped_column(IdType, comment='知识库分类id')

    """知识库id"""
    document_id: Mapped[str] = mapped_column(IdType, comment='知识库分类id')
    """文档id"""
