from langchain_core.runnables import RunnableConfig

import app
from app.constants.enums.graph_enums import ValueType
from app.constants.enums.tool_enum import ToolType
from app.core.agent.base_node import BmosNode, State, StateVariable
from app.core.agent.gragh.variable_parser import parse_variable, find_variable
from app.core.agent.tools.api_invoke import execute
from app.entities.tool import BaTool
from app.models.graph_model import NodeInfo
from app.models.tool import ApiRequest


class ToolNode(BmosNode):

    def __init__(self, node_info: NodeInfo, chat_id):
        super().__init__(node_info, chat_id)

    def node(self, state: State, config: RunnableConfig):
        tool_id = self.node_info.node_config.id
        with app.app.app_context():
            ba_tool = BaTool.query.filter_by(id=tool_id).first()
        if ba_tool is None:
            raise Exception("工具不存在")
        response = self.__execute_tool(ba_tool, state.variables)
        self._complete_put_output(response, self.node_info.outputs)

    def __execute_tool(self, ba_tool: BaTool, variables: list[StateVariable]):
        if ba_tool.type == ToolType.MCP:
            return
        elif ba_tool.type == ToolType.PYTHON:
            return
        return self.__execute_rest_tool(ba_tool, variables)

    def __execute_rest_tool(self, ba_tool, variables):
        api_request = ApiRequest.model_validate(ba_tool.attribute)
        inner_config = self.node_info.node_config.config
        if not inner_config.tool_params:
            api_request.request_data = {}
            tool_value = {tool_param.name: tool_param for tool_param in inner_config.tool_params}
            for api_param in api_request.params:
                tool_param = tool_value.get(api_param.name)
                if tool_param is None:
                    api_request.request_data[api_param.name] = None
                if tool_param.type != ValueType.VARIABLE_SELECTOR:
                    api_request.request_data[api_param.name] = api_param.value
                else:
                    cur_pram_variables = parse_variable(tool_param.value)
                    if len(variables) == 0:
                        api_request.request_data[api_param.name] = None
                    else:
                        cur_variable = find_variable(variables, cur_pram_variables[0])
                        api_request.request_data[api_param.name] = cur_variable.value if cur_variable else None
        return execute(api_request)