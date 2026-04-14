# -*- coding: utf-8 -*-
# @Time    : 2025/4/10 17:16
# @Author  : liang
# @FileName: graph_model.py
# @Software: PyCharm
from datetime import datetime

from pydantic import Field, BaseModel

from app.constants.enums.common_enum import EnableStatus
from app.constants.enums.knowledge_enum import MatchingType
from app.models.common.page import PageRequest
from app.models.document import DocumentInfo
from app.utils.tree_util import BmosTreeNode


class KnowledgeBaseCategoryCreateDTO(BaseModel):
    """知识库分类创建DTO"""
    name: str = Field(description='知识库分类名称')
    parent_id: str | None = Field(None, description='父级分类id')


class KnowledgeBaseCategory(BmosTreeNode):
    """知识库分类"""
    name: str = Field(description='知识库分类名称')
    children: list["KnowledgeBaseCategory"] | None = Field(None, description='子分类')


KnowledgeBaseCategory.model_rebuild()


class KnowledgeBaseCategoryEditDTO(BaseModel):
    """知识库分类编辑DTO"""
    id: str = Field(description='id')
    name: str = Field(description='知识库分类名称')


class KnowledgeBaseCreateDTO(BaseModel):
    name: str = Field(description='知识库名称')
    category_id: str | None = Field(None, description='知识库分类id')
    serial: str = Field(description='知识库编号')
    document_ids: list[str] = Field(description='文档id列表')
    dept_ids: list[str] = Field(description='知识库部门id列表')


class KnowledgeBaseEditDTO(BaseModel):
    id: str = Field(description='知识库id')
    name: str = Field(description='知识库名称')
    category_id: str = Field(description='知识库分类id')
    serial: str = Field(description='知识库编号')
    document_ids: list[str] = Field(description='文档id列表')


class KnowledgeBasePageRequest(PageRequest):
    category_id: str | None = Field(None, description='知识库分类id')
    name: str | None = Field(None, description='知识库名称')
    serial: str | None = Field(None, description='知识库编号')


class KnowledgeBasePageResponse(BaseModel):
    id: str = Field(description='知识库id')
    name: str = Field(description='知识库名称')
    serial: str = Field(description='知识库编号')
    category_id: str | None = Field(None, description='文档分类id')
    category_name: str | None = Field(None, description='文档分类名称')
    update_user: str | None = Field(None, description='更新人')
    update_time: datetime | None = Field(None, description='更新时间')
    status: EnableStatus = Field(description='状态')


class KnowledgeBaseRetrievalQuery(BaseModel):
    knowledge_base_id: str = Field(description='知识库id')
    text: str = Field(description='召回测试内容')
    matching_type: MatchingType = Field(MatchingType.VECTOR, description='匹配类型')
    top_k: int = Field(10, description='召回top_k')
    score_threshold: float = Field(0.5, description='召回阈值', ge=0, le=1, multiple_of=0.01)
    rerank: bool = Field(False, description='是否rerank')


class KnowledgeBaseInfo(BaseModel):
    id: str = Field(description='知识库id')
    name: str = Field(description='知识库名称')
    serial: str = Field(description='知识库编号')
    category_id: str = Field(description='文档分类id')
    category_name: str = Field(description='文档分类名称')
    update_user: str | None = Field(None, description='更新人')
    update_time: datetime | None = Field(None, description='更新时间')
    status: EnableStatus = Field(description='状态')
    documents: list[DocumentInfo] | None = Field(None, description='文档列表')