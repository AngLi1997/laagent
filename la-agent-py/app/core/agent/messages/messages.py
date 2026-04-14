# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 17:58
# @Author  : liang
# @FileName: messages.py
# @Software: PyCharm
from typing import Any, Literal

from pydantic import BaseModel


class BaseMessage(BaseModel):

    """对话响应基类"""
    message_type: Literal['start', 'end', 'search_online_result',
                'thinking', 'text', 'tool_calling',
                'tool_result', 'document_link', 'recommended_question', 'error'] = None

    node_id: str | int | None = None
    """节点id"""

    """消息类型"""
    conversation_id: str | int | None = None
    """对话id"""
    question_id: str | int | None = None
    """问题id"""
    answer_id: str | int | None = None
    """答案id"""
    # input: str | None = None
    # """输入"""
    content: str | None = None
    """响应内容"""
    during: int | None = None
    """耗时"""

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "start"


class StartMessage(BaseMessage):
    """消息开始"""
    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "start"


class EndMessage(BaseMessage):
    """消息结束"""
    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "end"


class SearchOnlineResultMessage(BaseMessage):
    """在线搜索消息"""
    engine: str
    title: str
    result: str
    url: str
    def __init__(self, /, **data: Any):
        super().__init__(**data)
        self.message_type = "search_online_result"


class TextMessage(BaseMessage):
    """文本消息"""

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "text"


class ToolCallingMessage(BaseMessage):
    """工具调用消息"""

    key: str | int
    """key"""
    tool_id: str | int | None = None
    """工具id"""
    tool_name: str | None
    """工具名称"""
    tool_param: dict | None = None
    """工具参数"""

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "tool_calling"


class ToolResultMessage(BaseMessage):
    """工具调用结果消息"""
    tool_calling_key: str | int
    """工具调用id"""
    tool_name: str | None
    """工具名称"""
    tool_id: str | int | None = None
    """工具id"""
    tool_param: dict | None = None
    """工具参数"""
    result: dict | str | None = None
    """工具调用结果"""
    error_msg: str | None = None
    """错误信息"""

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "tool_result"


class DocumentLinkMessage(BaseMessage):
    """文档消息"""

    knowledge_base_name: str | int | None = None
    """知识库名称"""
    document_name: str | int | None = None
    """文档名称"""
    document_id: str | int | None = None
    """文档id"""
    document_url: str | None = None
    """文档请求地址"""
    document_chunk_content: str | int | None = None
    """文档块内容"""
    document_chunk_id: str | int | None = None
    """文档块id"""

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "document_link"


class RecommendedQuestionMessage(BaseMessage):
    """推荐问题消息"""
    questions: list[str] = []

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "recommended_question"


class ErrorMessage(BaseMessage):
    """错误消息"""
    error: str | None = None

    def __init__(self, /, **data: Any) -> None:
        super().__init__(**data)
        self.message_type = "error"
