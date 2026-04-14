from datetime import datetime
from typing import Optional, List, Dict, Any

from pydantic import BaseModel, Field

from app.constants.enums.common_enum import EnableStatus
from app.constants.enums.tool_enum import ToolType
from app.models.common.page import PageRequest
from app.utils.tree_util import BmosTreeNode


class AgentCategoryRequest(BaseModel):
    id: str = Field('分类id',description="分类id")
    name: str = Field('分类名称',description="分类名称")
    parent_id: int | None = Field(None,description="父分类id，为空代表顶层")

class AgentCategoryQueryResponse(BmosTreeNode):
    name: str = Field(description='智能体分类名称')
    children: Optional[list["AgentCategoryQueryResponse"]] = Field(None, description='子分类')

class AgentQueryRequest(PageRequest):
    name: str = Field(None,description="应用名称")
    category_id: int = Field(None,description="分类id")

class AgentQueryResponse(BaseModel):
    id: str = Field(description="id")
    name: str = Field('智能体名称',description="智能体名称")
    description: str | None = Field('智能体描述',description="智能体描述")
    category_id: str = Field('分类',description="分类id")
    category_name: str = Field('分类',description="分类名称")
    status: EnableStatus = Field(description="是否启用")
    update_user: str | None = Field('最后更新人',description="最后更新人")
    update_time: datetime | None = Field('最后更新时间',description="最后更新时间")

class ModelConfig(BaseModel):
    url: str = Field(..., description="Ollama服务地址")
    model: str = Field(..., description="模型名称（含版本）")
    # 其他已知核心参数
    temperature: Optional[float] = Field(0.7, ge=0, le=2)
    # 动态扩展字段
    extra_params: Dict[str, Any] = Field(default_factory=dict)

    @property
    def ollama_kwargs(self) -> Dict[str, Any]:
        base_params = {
            "base_url": self.url,
            "models": self.model,
            "temperature": self.temperature
        }
        return {**base_params, **self.extra_params}


class AgentArgs(BaseModel):
    model: ModelConfig
    tools: List[int]

class QueryId(BaseModel):
    id: int = Field(None,description='id')

class ListResponse(BaseModel):
    id: str = Field(description="id")
    name: str = Field(description="名称")

class ToolListResponse(ListResponse):
    type: ToolType = Field(description="工具类型")
    mcp_json: str | None = Field(description="mcp服务json")

class LlmListResponse(ListResponse):
    args: str = Field(description="参数")

class AgentListResponse(ListResponse):
    icon_url: str = Field(description="智能体头像路径")
    description: str | None = Field(description="描述")
    args: str | None = Field(description="参数")
    category_id: str = Field(description="分类id")

class AgentRequest(BaseModel):
    id: int = Field(None,description="id")
    name: str = Field(None,description="应用名称")
    icon_url: str = Field(None,description="智能体头像地址")
    category_id: int = Field(None,description="分类id")
    description: str | None = Field(None,description="智能体描述")
    args: str = Field(None,description="流程json")
    dept_ids: list[str] = Field(None,description='部门id列表')

class AgentStatusRequest(BaseModel):
    id: int = Field(None,description="id")
    status: str = Field(description="enable|disable")