# -*- coding: utf-8 -*-
# @Time    : 2025/5/6 11:12
# @Author  : liang
# @FileName: plan_and_execute.py
# @Software: PyCharm
import asyncio
import json

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import StructuredTool
from langchain_experimental.plan_and_execute import load_chat_planner, PlanAndExecute
from langchain_experimental.plan_and_execute.schema import Step
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.types import StreamWriter

from app.app_init import app
from app.blueprints.tool_blueprint import test_mcp_server_invoke, extract_mcp_info
from app.constants.enums.tool_enum import ToolType
from app.core.agent.flow.agent_executor import custom_load_agent_executor
from app.core.agent.flow.graph_components import LLMNode
from app.core.agent.messages.messages import TextMessage, ToolCallingMessage, ToolResultMessage
from app.models.tool import ToolInvokeRequest, ToolInfo


def plan_and_execute(llm: BaseChatModel, latest_question: str, node: LLMNode, ids: list[str], writer: StreamWriter) -> str:
    with app.app_context():
        tools = []
        from app.entities.tool import BaTool
        if not ids:
            return ""
        ba_tools = BaTool.query.filter(BaTool.id.in_(ids))
        for ba_tool in ba_tools:
            print(f"加载工具: tool_id={ba_tool.id}")
            tools = [*_invoke(ba_tool)]
    planner = load_chat_planner(llm, (
        "理解问题并制定解决问题的计划。"
        "计划中不需要考虑登陆和授权相关步骤，可以直接调用工具"
        "计划的任务只可以必要的调用工具和必要的分析，要尽量减少任务总数"
        "请以‘任务规划： ’开头输出计划。"
        "随后用编号列表列出步骤。"
        "确保每个步骤都在可用工具范围内"
        "避免多次调用相同的工具"
        "如果任务是一个问题，最后一步就是‘根据上述步骤，请回应用户的原始问题’。"
        "在计划结束时，输出'<END_OF_PLAN>'"
    ))
    executor = custom_load_agent_executor(llm, tools, verbose=False)
    agent = PlanAndExecute(planner=planner, executor=executor, verbose=False)
    return asyncio.run(listen_messages(latest_question, agent, node, writer))


async def listen_messages(latest_question: str, agent, node, writer):
    resp = ""
    async for chunk in agent.astream_events({"input": latest_question}):
        if chunk.get('event') == 'on_chat_model_stream':
            token = chunk.get('data').get('chunk').content
            writer(TextMessage(content=token, node_id=chunk.get('run_id')))
            print(chunk)
        elif chunk.get('event') == 'on_tool_start':
            print(f"调用工具 => {chunk.get('name')}")
            print(chunk)
            writer(ToolCallingMessage(node_id=chunk.get('run_id'), key=chunk.get('run_id'), tool_id="1", tool_name=chunk.get('name'), tool_param=chunk.get('data').get('input')))
        elif chunk.get('event') == 'on_tool_end':
            print(f"调用工具结束 => {chunk.get('data').get('output')}")
            writer(
                ToolResultMessage(node_id=chunk.get('run_id'), tool_calling_key=chunk.get('run_id'), tool_id="1", tool_name=chunk.get('name'),
                                  result=chunk.get('data').get('output'), tool_param=chunk.get('data').get('input')))
        elif chunk.get('event') == 'on_chain_start':
            step: Step = chunk.get('data').get('input').get('current_step')
            if step and chunk.get('name') == 'AgentExecutor':
                writer(TextMessage(content=f'<div style="color: rgb(40, 113, 255)">执行步骤 → {step.value}</div>', node_id=chunk.get('run_id')))
        elif chunk.get('event') == 'on_chain_end':
            resp = chunk.get('data').get('output').get('output')
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

                    res.append(StructuredTool(name=mcp_tool.name, description=mcp_tool.description,
                                              coroutine=get_mcp_tool_func, args_schema=mcp_tool.args_schema))



