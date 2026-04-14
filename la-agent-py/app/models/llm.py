from datetime import datetime
from threading import Lock
from typing import Optional, Dict, Any

from langchain_core.messages import BaseMessage
from pydantic import BaseModel, Field

from app.constants.enums.llm_enum import KeyTypeEnum
from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class ModelQueryRequest(PageRequest):
    name: str | None = Field(None,description="模型名称")

class ModelQueryResponse(BaseModel):
    id: str = Field("模型id",description="模型id")
    name: str = Field('模型名称',description="模型名称")
    version: str = Field('版本',description="版本")
    description: str = Field('描述',description="描述")
    args: str = Field('参数大小',description="参数大小")
    temperature: str = Field('创造力', description="创造力")
    update_time: Optional[datetime] = None
    update_user: Optional[str] = None
    url: str = Field(description="模型地址")
    type: str = Field(description="模型类型")

class ModelRequest(BaseModel):
    name: str = Field(description="模型名称")
    version: str = Field(description="模型版本")
    description: Optional[str] = Field(default='', description="模型描述")
    args: str = Field(description="参数大小")
    temperature: float | str | dict[str, Any] = Field(description="创造力")
    url: str = Field(description="模型地址")
    api_key: str = Field(description="apiKey")
    key_type: KeyTypeEnum = Field(description="密钥类型")

class ModelCallingRequest(BaseModel):
    id: int | str =  dynamic_str_field(description="模型id")
    message:str | int = dynamic_str_field(description='内容')

class SessionMemoryManager:
    def __init__(self):
        self.memories: Dict[str, list[BaseMessage]] = {}
        self.lock = Lock()  # 防止并发冲突

    def get_messages(self, session_id: str) -> list[BaseMessage]:
        with self.lock:
            return self.memories.get(session_id, [])

    def save_messages(self, session_id: str, messages: list[BaseMessage]):
        with self.lock:
            if len(self.memories) > 1000:
                oldest_key = next(iter(self.memories))
                del self.memories[oldest_key]
            self.memories[session_id] = messages
