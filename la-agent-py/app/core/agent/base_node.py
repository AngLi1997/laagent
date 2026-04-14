from abc import ABC, abstractmethod
from functools import wraps
from typing import Annotated, Optional

from langchain_core.runnables import RunnableConfig
from loguru import logger
from pydantic import Field, ConfigDict

from app.constants.constants.graph_contants import GRAPH_ENV_START_WITH
from app.constants.enums.graph_enums import StateGraphVariablePutTypeEnum
from app.core.agent.messages.messages import *
from app.models.graph_model import NodeInfo, NodeInputOutput


class StateVariable(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    node_variable_name: str = Field(description="节点名称.变量名")

    value : Optional[any] = Field(default=None, description="变量值")

    put_type: StateGraphVariablePutTypeEnum = Field(description="变量类型")

    output_to_user: bool = Field(description="节点输出是否传递给用户")

def _put_messages(old_messages, cur_messages):
    if old_messages is None:
        old_messages = []
    old_messages.extend(cur_messages)
    return old_messages

def _put_variables(old_variables: list[StateVariable], variables: list[StateVariable]):
    if old_variables is None:
        old_variables = []
    old_variables.extend(variables)
    return old_variables


class State(BaseModel):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list[StartMessage | EndMessage | SearchOnlineResultMessage
                             | TextMessage | ToolCallingMessage | ToolResultMessage
                             | DocumentLinkMessage | RecommendedQuestionMessage | ErrorMessage], _put_messages]
    """每个节点运行后存放的消息"""

    variables: Annotated[list[StateVariable], _put_variables]
    """节点变量"""



class BmosNode(ABC):

    def __init__(self, node_info: NodeInfo, chat_id):
        self.env = None
        self.node_info = node_info # 当前节点的配置信息
        self.chat_id = chat_id

    @abstractmethod
    def node(self, state: State, config: RunnableConfig):
        """LangGraph中的节点"""
        pass

    def _append_out_message(self, messages: list):
        if not self.node_info.output_to_user:
            return
        for message in messages:
            print(messages)

    def _complete_put_output(self, result, output_params) -> list[StateVariable]:
        node_name = self.node_info.node_name
        return [StateVariable(node_variable_name=f"{node_name}.{out_param.param_name}",
                              value=result,
                              put_type= StateGraphVariablePutTypeEnum.OUTPUT,
                              output_to_user=self.node_info.output_to_user) for out_param in output_params]

    def _complete_put_params(self, variable_value: dict[str, str], input_output_params: list[NodeInputOutput], put_type: StateGraphVariablePutTypeEnum) -> list[StateVariable]:
        node_name = self.node_info.node_name
        return [StateVariable(node_variable_name = f"{node_name}.{input_output_param.param_name}", value = variable_value[input_output_param.param_name],
                                                          put_type = put_type,
                                                          output_to_user = self.node_info.output_to_user if put_type == StateGraphVariablePutTypeEnum.OUTPUT else False)  for input_output_param in input_output_params]


    def _complete_default_params(self,  input_output_params: list[NodeInputOutput], put_type) ->list[StateVariable]:
        node_name = self.node_info.node_name
        return [ StateVariable(node_variable_name = f"{node_name}.{input_param.param_name}", value = input_param.input_value,
                               put_type= put_type, output_to_user = self.node_info.output_to_user if put_type == StateGraphVariablePutTypeEnum.OUTPUT else False) for input_param in input_output_params]

    def _complete_env_params(self) -> list[StateVariable]:
        if self.env is None:
            return []
        return [StateVariable(node_variable_name = f"{GRAPH_ENV_START_WITH}{key}", value = value,
                               put_type= StateGraphVariablePutTypeEnum.ENV, output_to_user = False) for key, value in self.env.items()]

def error_handle_node():
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            try:
                result = func(self *args, **kwargs)
            except Exception as e:
                logger.error(f"节点{self.node_info.node_name}执行出错, {e}")
                result = {"messages": [ErrorMessage(node_id = self.node_info.llm_node_id, error=str(e))]}
            return result

        return wrapper
    return decorator