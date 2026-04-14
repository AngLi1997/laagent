from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, Field

from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class ChatHistoriesQuery(PageRequest):

    agent_name: Optional[str] = Field(None, description='智能体名称')
    """智能体名称"""

    title: Optional[str] = Field(None, description='对话标题')
    """对话标题"""

    user_id: Optional[str | int] = dynamic_str_field(None, description='用户id')
    """用户id"""

    keyword_group: Optional[str] = Field(default=None, description='命中词组')
    """命中词组"""

    last_chat_start_time: Optional[date] = Field(None, description='最后对话开始时间')
    """最后对话开始时间"""

    last_chat_end_time: Optional[date] = Field(None, description='最后对话结束时间')
    """最后对话结束时间"""


class ChatHistoriesPageResult(BaseModel):
    conversation_id: str | int = dynamic_str_field(description='对话id')
    """对话id"""

    title: str | int = dynamic_str_field(description='title')
    """对话标题"""

    agent_name: str | int | None = dynamic_str_field(description='智能体名称')
    """智能体名称"""

    user_name: str | int | None = dynamic_str_field(None, description='用户信息')
    """用户信息"""

    user_id: str | int | None = dynamic_str_field(None, description='用户id')
    """用户id"""

    last_chat_time: datetime | None = Field(description='上次对话时间')
    """上次对话时间"""

    reply_count: int = Field(description='回复数')
    """回复数"""

    admin_tag_like_count: Optional[int] = Field(None, description='用户标记数量')
    """管理员标记喜欢数量"""

    admin_tag_dislike_count: Optional[int] = Field(None, description='管理员标注数量')
    """管理员标记不喜欢数量"""

    user_tag_like_count: Optional[int] = Field(None, description='用户标记数量')
    """用户标记喜欢数量"""

    user_tag_dislike_count: Optional[int] = Field(None, description='管理员标注数量')
    """用户标注不喜欢数量"""

    keyword_group: Optional[str] = dynamic_str_field(None, description='命中词组')
    """命中词组"""

    hit_word: Optional[str] = dynamic_str_field(None, description='命中关键字')
    """命中关键词"""
