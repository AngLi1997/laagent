# -*- coding: utf-8 -*-
# @Time    : 2025/4/2 16:23
# @Author  : liang
# @FileName: graph_model.py
# @Software: PyCharm
"""视图"""
from datetime import datetime
from typing import Any

from flask_openapi3 import FileStorage
from pydantic import BaseModel, Field, field_validator

from app.constants.enums.common_enum import EnableStatus
from app.constants.enums.knowledge_enum import MatchingType
from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest
from app.utils.tree_util import BmosTreeNode


class DocumentCategoryCreateDTO(BaseModel):
    """文档分类创建DTO"""
    name: str | int = dynamic_str_field(description='文档分类名称')
    parent_id: str | int | None = dynamic_str_field(None, description='父级分类id')


class DocumentCategoryEditDTO(BaseModel):
    """文档分类编辑DTO"""
    id: str | int = Field(description='id')
    name: str = Field(description='文档分类名称')


class DocumentCategory(BmosTreeNode):
    """文档分类"""
    name: str = Field(description='文档分类名称')
    children: list["DocumentCategory"] | None = Field(None, description='子分类')


DocumentCategory.model_rebuild()


class DocumentItem(BaseModel):
    """文档"""
    id: str | int = dynamic_str_field(description='id')
    name: str = Field(description='名称')
    summary: str | None = Field(None, description='摘要')


class DocumentCategoryWithDocument(BmosTreeNode):
    """文档分类带文档列表"""
    name: str = Field(description='文档分类名称')
    children: list["DocumentCategoryWithDocument"] | None = Field(None, description='子分类')
    documents: list[DocumentItem] | None = Field(None, description='文档列表')


class DocumentUploadDTO(BaseModel):
    """文档上传参数"""
    category_id: str | int = Field(description='文档分类id')
    serial: str = Field(description='文档序列号')
    name: str = Field(description='文档名称')
    file: FileStorage = Field(description='文件')
    document_url: str = Field(description='文档url')
    dept_ids: list[str] = Field(description='文档部门id列表')


class DocumentCreateDTO(BaseModel):
    """文档创建参数"""
    category_id: str = Field(description='文档分类id')
    serial: str = Field(description='文档序列号')
    name: str = Field(description='文档名称')
    content: str | int | None = Field(None, description='文本内容')
    document_url: str | None = Field(None, description='文档url')
    dept_ids: list[str] = Field(description='文档部门id列表')

    @field_validator('name')
    @classmethod
    def validate_url(cls, v: str):
        if not v:
            raise ValueError('文档名称不能为空')
        # 判断是否是网址格式
        if v.startswith(('http://', 'https://')):
            raise ValueError('文档名称不能是网址')
        return v



class DocumentEditDTO(BaseModel):
    """文档创建参数"""
    id: str = Field(description='文档id')
    category_id: str = Field(description='文档分类id')
    serial: str = Field(description='文档序列号')
    name: str = Field(description='文档名称')


class DocumentPageRequest(PageRequest):
    category_id: str | None = Field(None, description='文档分类id')
    serial: str | None = Field(None, description='文档序列号')
    name: str | None = Field(None, description='文档名称')


class DocumentChunkPageRequest(PageRequest):
    document_id: str = Field(description='文档id')
    content: str | None = Field(None, description='内容')


class DocumentRetrievalQuery(BaseModel):
    document_id: str = Field(description='文档id')
    text: str = Field(description='召回测试内容')
    matching_type: MatchingType = Field(MatchingType.VECTOR, description='匹配类型')
    top_k: int = Field(10, description='召回top_k')
    score_threshold: float = Field(0.5, description='召回阈值', ge=0, le=1, multiple_of=0.01)
    rerank: bool = Field(False, description='是否rerank')


class DocumentRetrievalChunk(BaseModel):
    """召回文本片段"""
    chunk_id: str = Field(description='分段id')
    chunk_name: str = Field(description='分段名称')
    chunk_index: int = Field(description='分段序号')
    content: str = Field(description='文本内容')
    length: int = Field(description='分段长度')
    keywords: list[str] | None = Field(None, description='关键词')
    score: float | None = Field(None, description='相似度')
    document_id: str | None = Field(None, description='引用文档id')
    document_name: str | None = Field(None, description='引用文档名称')
    document_source_url: str | None = Field(None, description='文档来源url')
    knowledge_base_name: str | None = Field(None, description='知识库名称')


class DocumentPageResponse(BaseModel):
    id: str = Field(description='文档id')
    name: str = Field(description='文档名称')
    serial: str = Field(description='文档序列号')
    category_id: str = Field(description='文档分类id')
    category_name: str = Field(description='文档分类名称')
    update_user: str | None = Field(None, description='更新人')
    update_time: datetime | None = Field(None, description='更新时间')
    status: EnableStatus = Field(description='状态')


class DocumentInfo(BaseModel):
    id: str = Field(description='文档id')
    name: str = Field(description='文档名称')
    serial: str = Field(description='文档序列号')
    category_id: str = Field(description='文档分类id')
    category_name: str = Field(description='文档分类名称')
    update_user: str | None = Field(None, description='更新人')
    update_time: datetime | None = Field(None, description='更新时间')
    status: EnableStatus = Field(description='状态')


class DocumentChunkPageResponse(BaseModel):
    id: str = Field(description='文档分段id')
    chunk_index: int = Field(description='分段序号')
    length: int = Field(description='内容长度')
    content: str = Field(description='分段内容')
    keywords: list[str] | None = Field(None, description='关键词')
    retrieval_count: int = Field(0, description='召回次数')


class DocumentSplitDTO(BaseModel):
    """文档分段参数"""
    document_id: str = Field(description='文档id')
    # category_id: str = Field(description='文档分类id')
    # serial: str = Field(description='文档序列号')
    # name: str = Field(description='文档名称')
    chunk_identifier: str | None = Field(None, description='分段标识符(多个使用空格隔开)')
    chunk_size: int = Field(200, description='分段最大长度')
    chunk_overlap: int = Field(0, description='重叠长度')
    trip: bool = Field(False, description='替换掉连续的空格、换行符和制表符')
    clear_url: bool = Field(False, description='删除所有URL和电子邮件地址')
    return_size: int = Field(20, description='最大返回分段数量')


class DocumentChunk(BaseModel):
    id: str | None = Field(None, description='分段id')
    chunk_index: int = Field(description='分段序号')
    length: int = Field(description='内容长度')
    content: str = Field(description='分段内容')
    keywords: list[str] | None = Field(None, description='关键词')
    retrieval_count: int | None = Field(0, description='召回次数')


class DocumentChunkCreateDTO(BaseModel):
    document_id: str = Field(description='文档id')
    content: str = Field(description='分段内容')
    keywords: list[str] | None = Field(None, description='关键词')


class DocumentChunkEditDTO(BaseModel):
    id: str = Field(description='分段id')
    content: str = Field(description='分段内容')
    keywords: list[str] | None = Field(None, description='关键词')


class DocumentChunkInfo(BaseModel):
    chunk_size: int = Field(description='分段总数')
    chunk_list: list[DocumentChunk] = Field(description='分段列表')
    document_id: str | None = Field(None, description='文档id')

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
