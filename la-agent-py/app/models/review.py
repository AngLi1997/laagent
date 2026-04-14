from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.constants.enums.review_enums import HandleMethodEnum
from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class ChatSensitiveCreateDTO(BaseModel):
    """创建内容审查DTO"""
    word_group: str = Field(description='词组名称')
    handle_method: HandleMethodEnum = Field(description='处理方式')
    keyword_group: str = Field(description='关键词组')
    canned_answer: Optional[str] = Field(None, description='预设答案')

class ChatSensitiveUpdateDTO(ChatSensitiveCreateDTO):
    """更新内容审查DTO"""
    id: str = Field(description='id')

class ChatReviewQuery(PageRequest):
    """分页查询内容审查"""
    word_group: Optional[str] = Field(None, description='词组名称')

class ChatReviewPageResult(BaseModel):
    id: str = Field(description='id')
    word_group: str = Field(description='词组名称')
    handle_method: HandleMethodEnum = Field(description='处理方式')
    keyword_group: str = Field(description='关键词组')
    canned_answer: Optional[str] = Field(None,  description='预设答案')
    hit_count: int = Field(description='命中次数')
    enable: bool = Field(description='是否启用')
    update_time: Optional[datetime] = Field(description='更新时间')

class ChatReviewDetailResult(BaseModel):
    id: str = Field(description='id')
    word_group: str = Field(description='词组名称')
    handle_method: HandleMethodEnum = Field(description='处理方式')
    keyword_group: str = Field(description='关键词组')
    canned_answer: Optional[str] = Field(None, description='预设答案')

class ChatReviewMessage(BaseModel):
    """被转换/直接返回的消息"""
    message: str = Field(description='消息')
    word_group: Optional[list[str]] = Field(None, description='命中词组名称')
    keyword_group: Optional[set[str]] = Field(None, description='命中关键字')


class ChatReviewOperateDTO(BaseModel):
    """操作内容审查DTO"""
    enable: bool = Field(True, description='是否启用')

class ChatReviewPath(BaseModel):
    chat_review_id: str | int = dynamic_str_field(description='id')

class SensitiveHistory(BaseModel):
    chat_review_id: int | str = dynamic_str_field(description='内容审核id')
    message: int | str = dynamic_str_field(description='消息')
    hit_keyword: int | str = dynamic_str_field(description='命中敏感词')


# class ReviewInterceptionRecordResult(BaseModel):
#     """内容审核拦截记录"""
#     chat_review_id: str = Field(description='内容审核id')
#     message: str = Field(description='消息')
#     hit_keyword: str = Field(description='命中敏感词')
