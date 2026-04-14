# -*- coding: utf-8 -*-
# @Time    : 2025/4/27 10:56
# @Author  : liang
# @FileName: graph_components.py
# @Software: PyCharm
from typing import Literal

from pydantic import BaseModel

from app.constants.enums.knowledge_enum import MatchingType


class GraphConfig(BaseModel):
    nodes: list = []
    edges: list = []
    envs: list = []

    def get_endpoints(self) -> tuple[str, str]:
        """获取起始节点"""
        s = [n for n in self.nodes if n['node_type'] == 'start'][0]
        e = [n for n in self.nodes if n['node_type'] == 'end'][0]
        return s['node_name'], e['node_name']

class Input(BaseModel):
    param_name: str
    input_type: Literal['string','number','bool','variable_selector']
    input_value: str

class BaseNode(BaseModel):
    node_id: str
    node_name: str
    node_type: Literal["start", "end", "llm", "kb", "tool", "condition"]
    inputs: list[Input] = []
    outputs: list = []
    output_to_user: bool = False
    error_handler: dict = None
    styles: str = None


class Edge(BaseModel):
    id: str
    from_node: str
    to_node: str
    from_case: str = None
    styles: str = None


class Prompt(BaseModel):
    type: str
    prompt: str

class LLMNodeConfig(BaseModel):
    id: str
    config: dict = None
    prompts: list[Prompt]
    tool_ids: list[str] = []

class ToolConfigParam(BaseModel):
    name: str
    type: str
    value: str

class ToolConfig(BaseModel):
    tool_params: list[ToolConfigParam] | None = []
    settings: list | None = []

class ToolNodeConfig(BaseModel):
    id: str = None
    tool_name: str | None = None
    config: ToolConfig | None = None

class ConditionCaseItem(BaseModel):
    key: str | int = None
    variable_selector: str = None
    operator: Literal["is", "not", "contains", "not_contains", "is_null", "not_null"]
    value: str = None
    value_type: Literal["string", "number", "bool", "variable_selector"] = None


class ConditionCase(BaseModel):
    key: str | int = None
    conditions: list[ConditionCaseItem] = []
    logic: str = None

class ConditionNodeConfig(BaseModel):
    cases: list[ConditionCase] = []


class KnowledgeBaseRetrievalConfig(BaseModel):
    matching_type: MatchingType | None = None
    top_k: int | None = 3
    score_threshold: float | None = 0.3
    rerank: bool | None = False

class KnowledgeBaseNodeConfig(BaseModel):
    id: str | int = None
    config: KnowledgeBaseRetrievalConfig | None = None


class LLMNode(BaseNode):
    node_config: LLMNodeConfig

class ToolNode(BaseNode):
    node_config: ToolNodeConfig

class ConditionNode(BaseNode):
    node_config: ConditionNodeConfig

class KnowledgeBaseNode(BaseNode):
    node_config: KnowledgeBaseNodeConfig