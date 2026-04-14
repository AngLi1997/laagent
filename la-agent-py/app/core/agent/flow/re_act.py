# -*- coding: utf-8 -*-
# @Time    : 2025/5/6 11:12
# @Author  : liang
# @FileName: re_act.py.py
# @Software: PyCharm
import asyncio
import json
from typing import Any, Optional
from uuid import UUID

from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.agents import AgentAction, AgentFinish
from langchain_core.callbacks import BaseCallbackManager, BaseCallbackHandler
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import StructuredTool, render_text_description_and_args
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.types import StreamWriter
from loguru import logger

from app.app_init import app
from app.blueprints.tool_blueprint import test_mcp_server_invoke, extract_mcp_info
from app.constants.enums.tool_enum import ToolType
from app.core.agent.flow.graph_components import LLMNode
from app.core.agent.messages.messages import TextMessage, ToolCallingMessage, ToolResultMessage
from app.core.prompts import RE_ACT_AGENT
from app.exception.exception_handler import TerminalException, get_exception_trace
from app.models.tool import ToolInvokeRequest, ToolInfo
from app.utils.str_util import string_to_dict


class CustomCallbackHandler(BaseCallbackHandler):

    def on_agent_action(
        self,
        action: AgentAction,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        **kwargs: Any,
    ) -> Any:
        try:
            params_str = action.tool_input
            action.tool_input = string_to_dict(params_str)
        except Exception as e:
            logger.error(f'参数转换异常: {action.tool_input}, {get_exception_trace(e)}')
        super().on_agent_action(action, run_id=run_id, parent_run_id=parent_run_id, **kwargs)

def re_act(llm: BaseChatModel, latest_question: str, node: LLMNode, ids: list[str], writer: StreamWriter, search_results: list) -> str:
    with app.app_context():
        from app.entities.tool import BaTool
        tools = []
        if ids:
            try:
                ba_tools = BaTool.query.filter(BaTool.id.in_(ids))
                for ba_tool in ba_tools:
                    print(f"加载工具: tool_id={ba_tool.id}")
                    tools = [*_invoke(ba_tool)]
            except Exception as e:
                logger.error(f'{get_exception_trace(e)}')
                raise TerminalException("mcp服务异常")
        else:
            tools = []
        p_template = ""
        if search_results:
            p_template = p_template + f"联网搜索结果: \n{[r.get('content') for r in search_results]}\n"
        prompt = PromptTemplate.from_template(p_template + RE_ACT_AGENT)
        agent = create_react_agent(llm, tools, prompt, tools_renderer=render_text_description_and_args)
        executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True, callbacks=BaseCallbackManager(handlers=[CustomCallbackHandler()]))
        return asyncio.run(listen_messages(latest_question, executor, node, writer))

async def listen_messages(latest_question: str, agent, node, writer):
    resp = ""
    async for chunk in agent.astream_events({"input": latest_question}):
        print(chunk)
        if chunk.get('event') == 'on_chat_model_stream':
            token = chunk.get('data').get('chunk').content
            writer(TextMessage(content=token, node_id=chunk.get('run_id')))
        elif chunk.get('event') == 'on_tool_start':
            if chunk.get('name') != "invalid_tool":
                print(f"调用工具 => {chunk.get('name')}")
                writer(ToolCallingMessage(node_id=chunk.get('run_id'), key=chunk.get('run_id'), tool_id="1", tool_name=chunk.get('name'), tool_param=chunk.get('data').get('input')))
        elif chunk.get('event') == 'on_tool_end':
            if chunk.get('name') != "invalid_tool":
                print(f"调用工具结束 => {chunk.get('data').get('output')}")
                writer(
                    ToolResultMessage(node_id=chunk.get('run_id'), tool_calling_key=chunk.get('run_id'), tool_id="1", tool_name=chunk.get('name'),
                                      result=chunk.get('data').get('output'), tool_param=chunk.get('data').get('input')))
        elif chunk.get('event') == 'on_chain_end':
            output = chunk.get('data').get('output')
            if output and isinstance(output, AgentFinish):
                resp = output.return_values["output"]
    return resp


def _invoke(ba_tool):
    res = []
    json_config = json.loads(ba_tool.attribute)
    if ba_tool.type == ToolType.MCP:
        asyncio.run(get_mcp_tools(ba_tool, json_config, res))
    elif ba_tool.type == ToolType.REST:
        params = json_config["params"]
        args_schema = {
            "type": "object",
            "properties": {}
        }
        for p in params:
            if p.get("name") and p.get("paramType"):
                args_schema["properties"][p["name"]] = {
                    "type": p["paramType"],
                    "description": p["description"],
                }

        async def get_rest_tool_func(bt=ba_tool, **tool_invoke_params):
            with app.app_context():
                print(f"调用rest方法: tool_name={bt.name} tool_invoke_params={tool_invoke_params}")
                from app.blueprints.tool_blueprint import tool_invoke
                resp = tool_invoke(ToolInvokeRequest(tool_id=bt.id, arguments=tool_invoke_params))
                print(f"调用rest方法结束: tool_name={bt.name} resp={resp}")
                return resp
        res.append(StructuredTool(name=ba_tool.name, description=ba_tool.description, func=get_rest_tool_func,
                                  args_schema=args_schema))
    return res


async def get_mcp_tools(ba_tool, json_config, res):
    for k, v in json_config["mcpServers"].items():
        if v["type"] == "sse":
            async with MultiServerMCPClient({
                k: {
                    "url": v["baseUrl"],
                    "transport": "sse",
                }
            }) as client:
                for mcp_tool in client.get_tools():
                    async def get_mcp_tool_func(bt=ba_tool, mt=mcp_tool, **tool_invoke_params):
                        with app.app_context():
                            print(f"调用mcp方法: tool_name={mt.name} param={tool_invoke_params}")
                            tool_dict = extract_mcp_info(json.dumps(json_config, ensure_ascii=False))
                            resp = await test_mcp_server_invoke(ToolInfo(url=tool_dict["url"], tool_name=mt.name,
                                                                         argument=json.dumps(tool_invoke_params,
                                                                                             ensure_ascii=False)))
                            print(f"调用mcp方法结束: tool_name={mt.name} resp={resp}")
                            return resp

                    # 确保 args_schema 有正确的格式
                    args_schema = {
                        "type": "object",
                        "properties": {}
                    }
                    
                    if hasattr(mcp_tool, 'args_schema') and isinstance(mcp_tool.args_schema, dict):
                        if 'properties' in mcp_tool.args_schema:
                            args_schema['properties'] = mcp_tool.args_schema['properties']
                        if 'required' in mcp_tool.args_schema:
                            args_schema['required'] = mcp_tool.args_schema['required']
                    
                    res.append(StructuredTool(name=mcp_tool.name, description=mcp_tool.description,
                                              coroutine=get_mcp_tool_func, args_schema=args_schema))



