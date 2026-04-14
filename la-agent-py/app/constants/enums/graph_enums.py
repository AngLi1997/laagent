from enum import Enum


class NodeInputOutputTypeEnum(Enum):
    STRING = "string"
    NUMBER = "number"
    BOOL = "bool"
    VARIABLE_SELECTOR = "variable_selector"

class NodeTypeEnum(Enum):
    START = "start"
    END = "end"
    LLM = "llm"
    KB = "kb"
    TOOL = "tool"
    CONDITION = "condition"


class NodeErrorHandleType(Enum):
    """节点执行异常处理类型"""
    TERMINATE = "terminate"


class ToolNodeInnerConfigParamType(Enum):
    """工具节点参数类型 string number bool"""
    STRING = "string"
    NUMBER = "number"
    BOOL = "bool"


class ValueType(Enum):
    """工具节点参数值类型 string number bool variable_selector"""
    STRING = "string"
    NUMBER = "number"
    BOOL = "bool"
    VARIABLE_SELECTOR = "variable_selector"

class TollNodeInnerConfigSettingType(Enum):
    STRING = "string"
    NUMBER = "number"
    BOOL = "bool"

class ConditionOperatorEnum(Enum):
    """条件操作符 is,not,contains, not_contains, is_null, not_null"""
    IS = "is"
    NOT = "not"
    CONTAINS = "contains"
    NOT_CONTAINS = "not_contains"
    IS_NULL = "is_null"
    NOT_NULL = "not_null"

class LLMPromptType(Enum):
    """LLM节点的prompt类型"""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"

class StateGraphVariablePutTypeEnum(Enum):

    OUTPUT = "output"
    INPUT = "INPUT"
    ENV = "ENV"