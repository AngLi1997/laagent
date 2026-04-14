from langchain_core.runnables import RunnableConfig
from loguru import logger

from app.constants.enums.graph_enums import StateGraphVariablePutTypeEnum
from app.core.agent.base_node import BmosNode, State
from app.core.agent.messages.messages import StartMessage, EndMessage
from app.models.graph_model import NodeInfo


class StartNode(BmosNode):

    def __init__(self, node_info: NodeInfo, env: dict[str, str], variable_value: dict[str, str], chat_id):
        """
        param env: 环境变量以及变量值
        param variable_value: 变量名以及变量名的值
        """
        super().__init__(node_info, chat_id)
        self.env = env
        self.variable_value = variable_value

    
    def node(self, state: State, config: RunnableConfig):
        logger.info(f"【{self.node_info.node_name}】节点开始运行...")
        """如果时llm节点，将此方法传入LangGraph中"""
        variables = self._complete_put_params(self.variable_value, self.node_info.inputs, StateGraphVariablePutTypeEnum.INPUT)
        variables + (self._complete_env_params())
        bmos_messages = self.__build_messages()
        self._append_out_message(bmos_messages)
        logger.info(f"【{self.node_info.node_name}】节点结束运行 messages={bmos_messages}")
        return {"messages": bmos_messages, "variables": variables}

    def __build_messages(self):
        return [StartMessage(node_id=self.node_info.node_id)]

class EndNode(BmosNode):
    def __init__(self, node_info: NodeInfo, chat_id):
        super().__init__(node_info, chat_id)

    
    def node(self, state: State, config: RunnableConfig):
        logger.info(f"【{self.node_info.node_name}】节点开始运行...")
        bmos_messages = self.__build_messages()
        self._append_out_message(bmos_messages)
        logger.info(f"【{self.node_info.node_name}】节点结束运行, messages={bmos_messages}")
        return {"messages": bmos_messages}

    def __build_messages(self):
        return [EndMessage(node_id=self.node_info.node_id)]