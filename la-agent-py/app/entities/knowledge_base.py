# -*- coding: utf-8 -*-
# @Time    : 2025/4/10 17:33
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from sqlalchemy import String
from sqlalchemy.orm import mapped_column, Mapped, aliased

from app.constants.enums.common_enum import EnableStatus
from app.database.database_settings import Base, IdType, db
from app.entities.document import BaDocument
from app.entities.knowledge_base_document_relationship import BaKnowledgeBaseDocumentRelationship


class BaKnowledgeBaseCategory(db.Model, Base):
    """知识库分类"""
    parent_id: Mapped[str] = mapped_column(IdType, comment='知识库分类父id', nullable=True)
    name: Mapped[str] = mapped_column(String, comment='知识库分类名称')

    def __init__(self, parent_id: str = None, name: str = None):
        super().__init__()
        self.parent_id = parent_id
        self.name = name

    @classmethod
    def get_children(cls, parent_id) -> list["BaKnowledgeBaseCategory"]:
        return cls.query.filter_by(parent_id=parent_id).all()

    @classmethod
    def get_all_children(cls, parent_id: str) -> list["BaKnowledgeBaseCategory"]:
        """获取所有子节点"""
        if parent_id is None:
            return BaKnowledgeBaseCategory.query.all()
        # 定义初始查询（起始节点）
        initial_query = db.session.query(
            BaKnowledgeBaseCategory.id,
            BaKnowledgeBaseCategory.parent_id,
            BaKnowledgeBaseCategory.name
        ).filter(BaKnowledgeBaseCategory.id == parent_id).cte(name='recursive_cte', recursive=True)

        # 定义递归部分
        parent_alias = aliased(initial_query, name='parent')
        child_alias = aliased(BaKnowledgeBaseCategory, name='child')

        recursive_query = initial_query.union_all(
            db.session.query(
                child_alias.id,
                child_alias.parent_id,
                child_alias.name
                # 通过 parent_id 关联
            ).filter(child_alias.parent_id == parent_alias.c.id)
        )
        return db.session.query(recursive_query).all()


class BaKnowledgeBase(db.Model, Base):
    """知识库"""
    category_id: Mapped[str] = mapped_column(IdType, comment='知识库分类id')
    serial: Mapped[str] = mapped_column(String, comment='知识库编码')
    name: Mapped[str] = mapped_column(String, comment='知识库名称')
    status: Mapped[EnableStatus] = mapped_column(comment='启用状态', nullable=True)

    def __init__(self, category_id: str = None, serial: str = None, name: str = None, status: EnableStatus = None):
        super().__init__()
        self.category_id = category_id
        self.serial = serial
        self.name = name
        self.status = status


def get_documents_by_kb(kb: BaKnowledgeBase) -> list[BaDocument]:
    return (BaDocument.query
        .join(BaKnowledgeBaseDocumentRelationship, BaKnowledgeBaseDocumentRelationship.document_id == BaDocument.id,
              isouter=True)
        .filter(BaKnowledgeBaseDocumentRelationship.knowledge_base_id == kb.id)
        .all())


def get_documents_by_kb_ids(kb_ids: list[str]) -> list[BaDocument]:
    if not kb_ids:
        return []
    return (BaDocument.query
            .join(BaKnowledgeBaseDocumentRelationship,
                  BaKnowledgeBaseDocumentRelationship.document_id == BaDocument.id,
                  isouter=True)
            .filter(BaKnowledgeBaseDocumentRelationship.knowledge_base_id.in_(kb_ids))
            .all())
