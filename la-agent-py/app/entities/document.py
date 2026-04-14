# -*- coding: utf-8 -*-
# @Time    : 2025/4/9 11:12
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm

"""文档管理"""
from tempfile import NamedTemporaryFile

from sqlalchemy import String, Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, aliased

from app.constants.enums.common_enum import EnableStatus
from app.database.database_settings import Base, IdType, db
from app.utils.file_util import get_file_type, read_text_summary_from_storage, \
    get_size_of_tmp_file


class BaDocumentCategory(db.Model, Base):
    """文档分类"""
    parent_id: Mapped[str] = mapped_column(IdType, comment='文档分类父id', nullable=True)
    name: Mapped[str] = mapped_column(String, comment='文档分类名称')

    def __init__(self, parent_id: str = None, name: str = None):
        super().__init__()
        self.parent_id = parent_id
        self.name = name


    @classmethod
    def get_children(cls, parent_id) -> list["BaDocumentCategory"]:
        return cls.query.filter_by(parent_id=parent_id).all()

    @classmethod
    def get_all_children(cls, parent_id: str) -> list["BaDocumentCategory"]:
        """获取所有子节点"""
        if parent_id is None:
            return BaDocumentCategory.query.all()
        # 定义初始查询（起始节点）
        initial_query = db.session.query(
            BaDocumentCategory.id,
            BaDocumentCategory.parent_id,
            BaDocumentCategory.name
        ).filter(BaDocumentCategory.id == parent_id).cte(name='recursive_cte', recursive=True)

        # 定义递归部分
        parent_alias = aliased(initial_query, name='parent')
        child_alias = aliased(BaDocumentCategory, name='child')

        recursive_query = initial_query.union_all(
            db.session.query(
                child_alias.id,
                child_alias.parent_id,
                child_alias.name
                # 通过 parent_id 关联
            ).filter(child_alias.parent_id == parent_alias.c.id)
        )
        return db.session.query(recursive_query).all()


class BaDocument(db.Model, Base):
    """文档"""
    category_id: Mapped[str] = mapped_column(IdType, comment='文档分类id')
    serial: Mapped[str] = mapped_column(String, comment='文件序列号')
    name: Mapped[str] = mapped_column(String, comment='文件名')
    size: Mapped[int] = mapped_column(Integer, comment='文件大小')
    file_type: Mapped[str] = mapped_column(String, comment='文件类型(不带后缀)')
    source_url: Mapped[str] = mapped_column(String, comment='文件地址url', nullable=True)
    summary: Mapped[str] = mapped_column(String, comment='文件摘要', nullable=True)
    status: Mapped[EnableStatus] = mapped_column(comment='启用状态', nullable=True)


    def __init__(self, category_id: str = None, serial: str = None, name: str = None, size: int = None,
                 file_type: str = None, source_url: str = None, summary: str = None, status: EnableStatus = None, *args,
                 **kwargs):
        super().__init__(*args, **kwargs)
        self.category_id = category_id
        self.serial = serial
        self.name = name
        self.size = size
        self.file_type = file_type
        self.source_url = source_url
        self.summary = summary
        self.status = status


class BaDocumentChunk(db.Model, Base):
    """文档片段"""
    document_id: Mapped[str] = mapped_column(IdType, comment='文档id')
    chunk_index: Mapped[int] = mapped_column(Integer, comment='文档片段序号')
    content: Mapped[str] = mapped_column(String, comment='文档片段内容')
    length: Mapped[int] = mapped_column(Integer, comment='文档片段长度')
    keywords: Mapped[list[str]] = mapped_column(ARRAY(String), comment='文档片段关键词', default=[])
    retrieval_count: Mapped[int] = mapped_column(Integer, comment='文档片段召回次数', default=0)

    def __init__(self, document_id: str = None,
                 chunk_index: int = None,
                 content: str = None,
                 length: int = None,
                 keywords: list[str] = None):
        super().__init__()
        self.document_id = document_id
        self.chunk_index = chunk_index
        self.content = content
        self.length = length
        self.keywords = keywords



def file_storage_to_ba_document(file_storage: NamedTemporaryFile, url: str = None) -> BaDocument:
    ft = get_file_type(url)
    file_type = ft if ft else 'txt'
    """文件存储转文档"""
    return BaDocument(
        size=get_size_of_tmp_file(file_storage),
        file_type=file_type,
        source_url=url,
        summary=read_text_summary_from_storage(file_storage, file_type, 1000),
        status=EnableStatus.ENABLE
    )
