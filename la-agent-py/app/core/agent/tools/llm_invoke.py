import json
import re
from typing import List, Tuple, Optional

from langchain_core.messages import AIMessage, SystemMessage
from loguru import logger

from app.constants.enums.tool_enum import ToolType
from app.entities.tool import BaTool


def process_tool_decision(
        messages: List,  # LangGraph消息列表
        tools: List[BaTool],  # 工具列表
        llm  # 大模型对象
) -> Tuple[List, Optional[dict]]:
    """
    处理工具调用决策的公共方法

    Args:
        messages: 当前对话消息历史
        tools: 可用工具列表
        llm: 大模型实例

    Returns:
        Tuple[更新后的消息列表, 工具调用参数（如无需调用返回None）]
    """

    # 1. 构建系统提示模板
    tool_descs = build_tool_descriptions(tools)

    tool_desc_text = '\n'.join(tool_descs)
    system_prompt = f"""
    请尽可能准确地回答问题。你可使用以下工具：
        {tool_desc_text}
        1.当需要调用工具时，返回精确的JSON格式：
            {{
                "action": "工具名称",
                "action_input": {{参数键值对}}
            }}
        2. 得到ToolMessage后，必须且只能基于其content内容生成最终回复
        3. 如果调用了工具，务必结合工具返回的信息并结合用户的提问来生成最终的回复!
    """


    # 2. 构造提示消息链
    prompt_messages = [SystemMessage(content=system_prompt)]
    prompt_messages.extend(msg for msg in messages if not isinstance(msg, SystemMessage))

    # 3. 调用大模型获取响应
    try:
        response = llm.invoke(prompt_messages)
        logger.info(f"模型检测是否调用工具输出：{response.content}")
        response_content = response.content
    except Exception as e:
        print(f"模型调用失败：{str(e)}")
        return messages, None


    # 4. 解析工具调用指令
    try:
        # 尝试匹配被 ``` 包裹的 JSON
        json_match = re.search(r"```(?:json)?\n({.*?})\n```", response_content, re.DOTALL)
        if json_match:
            tool_call = json.loads(json_match.group(1))
        else:
            # 尝试从响应中提取第一个完整 JSON 对象（即使有额外文本）
            json_str = re.search(r"\{.*\}", response_content, re.DOTALL)
            if json_str:
                tool_call = json.loads(json_str.group())
            else:
                tool_call = None

        # 验证格式
        if not isinstance(tool_call, dict) or "action" not in tool_call:
            tool_call = None
    except json.JSONDecodeError:
        tool_call = None


    # 5. 处理工具调用逻辑
    updated_messages = messages.copy()

    if tool_call:
        # 添加模型决策消息
        updated_messages.append(
            AIMessage(content=json.dumps(tool_call, ensure_ascii=False)))

        return updated_messages, tool_call

    # 无需工具调用时直接返回原消息列表
    return messages, None


def build_tool_descriptions(tools: List[BaTool]) -> List[str]:
    tool_descs = []
    for tool in tools:
        # 基础信息
        desc = f"工具名称：{tool.name}\n功能描述：{tool.description}\n"

        # REST类型工具特殊处理
        if tool.type == ToolType.REST:
            try:
                tool_config = json.loads(tool.attribute)

                # 处理接口入参
                if 'params' in tool_config:
                    desc += "接口入参：\n"
                    for param in tool_config['params']:
                        required = "必填" if param.get('required', False) else "可选"
                        desc += (f"  - {param['name']}: {param['description']} "
                                 f"(类型:{param['paramType']}, 示例:{param.get('example', '无')}, {required})\n")

                # 处理响应定义
                if 'response_fields' in tool_config:
                    try:
                        response_example = json.loads(tool_config['response_fields'])
                        desc += f"响应定义示例：{json.dumps(response_example, ensure_ascii=False, indent=2)}\n"
                    except json.JSONDecodeError:
                        desc += f"响应定义：{tool_config['response_fields']}\n"

            except json.JSONDecodeError:
                desc += "接口配置解析失败\n"

        tool_descs.append(desc.strip())
    return tool_descs
