from pydantic import BaseModel, Field
from typing_extensions import Optional

from app.constants.enums.graph_enums import *
from app.constants.enums.knowledge_enum import MatchingType


class LLMNodeInnerConfig(BaseModel):
    """LLM节点内含有的配置"""
    temperature: float = Field(0.7, ge=0, le=1)
    top_k: int = Field(1)
    top_p: float = Field(1, ge=0, le=1)

class KbInnerConfig(BaseModel):
    """知识库节点内含有的配置"""
    matching_type: MatchingType = Field(description='匹配类型')
    top_k: int = Field(description='匹配数量')
    score_threshold: float = Field(description='匹配分数阈值', ge=0, le=1)
    rerank: bool = Field(description='是否重排序')

class ToolNodeInnerConfigParam(BaseModel):
    """工具节点配置参数"""
    name: str = Field(description='参数名')
    type: ToolNodeInnerConfigParamType = Field(description='参数类型')
    value: str = Field(default=None, description='参数值')
    value_type: ValueType = Field(default=None, description='参数值类型')

class ToolNodeInnerConfigSetting(BaseModel):
    """工具节点配置中的工具的设置"""
    name: str = Field(description='设置名称')
    type: TollNodeInnerConfigSettingType = Field(description='设置类型')
    value: str = Field(default=None, description='设置值')


class ToolNodeInnerConfig(BaseModel):
    """工具节点内含有的配置"""
    tool_params: Optional[list[ToolNodeInnerConfigParam]] = Field(default=[], description='工具参数')
    settings: Optional[list[ToolNodeInnerConfigSetting]] = Field(default=[], description='工具设置')

class ConditionCaseCondition(BaseModel):
    id: str = Field(description='条件id')
    variable_selector: Optional[str] = Field(default=None, description='变量选择器')
    operator: Optional[ConditionOperatorEnum] = Field(default=None, description='操作符')
    value: Optional[str] = Field(default=None, description='值')
    value_type: Optional[ValueType] = Field(default=None, description='值类型')

class ConditionCase(BaseModel):
    id: str = Field(description='条件分支id')
    conditions: Optional[list[ConditionCaseCondition]] = Field(default=[], description='条件分支条件')
    logic: Optional[str] = Field(default=None, description='条件分支逻辑')

class ConditionInnerConfig(BaseModel):
    cases: list[ConditionCase] = Field(description='条件分支')

class NodeBaseConfig(BaseModel):
    """节点的基础配置"""
    id: Optional[str] = Field(default=None , description='LLM的id/知识库id/工具id')
    """LLM的id/工具id 若是条件节点 则此id为None"""
    config: Optional[LLMNodeInnerConfig | KbInnerConfig | ToolNodeInnerConfig | ConditionInnerConfig] = Field(default=None, description='节点配置')
    """LLM对应的参数/工具对应的参数"""


class LLMPrompt(BaseModel):
    """LLM节点配置的提示词"""
    type: LLMPromptType = Field(description='类型')
    prompt: str = Field(description='内容')

class LLMNodeConfig(NodeBaseConfig):
    """LLM节点的配置"""
    prompts: list[LLMPrompt] = Field(description='提示词')


class KBNodeConfig(NodeBaseConfig):
    """知识库节点内含有的配置"""
    pass


class ToolNodeConfig(NodeBaseConfig):
    """工具节点内含有的配置"""
    pass

class ConditionConfig(NodeBaseConfig):
    pass

class NodeInputOutput(BaseModel):
    """节点输入变量"""
    param_name: str = Field(description='参数名')
    input_type: Optional[NodeInputOutputTypeEnum] = Field(default=None, description='输入变量类型')
    input_value: Optional[str] = Field(default=None, description='输入变量值')

class NodeErrorHandle(BaseModel):
    type: NodeErrorHandleType = Field(description='错误处理类型')

class NodeInfo(BaseModel):
    """节点信息"""

    node_id: str = Field(description='节点id')
    node_type: NodeTypeEnum = Field(description='节点类型')
    node_name: str = Field(description='节点名称')
    node_config: Optional[NodeBaseConfig] = Field(default=None, description='节点配置')
    inputs: Optional[list[NodeInputOutput]] = Field(default=[], description='节点输入变量')
    outputs: Optional[list[NodeInputOutput]] = Field(default=[], description='节点输出变量')
    error_handle: NodeErrorHandle = Field(description='节点错误处理')
    output_to_user: bool = Field(description='节点输出是否传递给用户')

class Edge(BaseModel):
    id: str = Field(description='边id')
    from_node: Optional[str] = Field(default=None, description='边起始节点id')
    to_node: str = Field(description='边结束节点id')
    from_case: Optional[str] = Field(default=None, description='边起始节点条件分支id')

class GraphInfo(BaseModel):
    nodes: list[NodeInfo] = Field(description='节点信息')
    edges: list[Edge] = Field(description='边信息')
    envs: Optional[dict[str, str]] = Field(default={}, description='环境变量')





