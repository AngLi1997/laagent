# -*- coding: utf-8 -*-
# @Time    : 2025/5/8 13:51
# @Author  : liang
# @FileName: re_act_test.py
# @Software: PyCharm
import asyncio

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from pydantic import SecretStr


@tool
def get_current_user():
    """获取当前登录人名称"""
    print("获取当前登录人")
    return "张三"


@tool
def get_age_by_name(name: str):
    """根据用户名称获取用户年龄"""
    print(f"获取{name}的年龄")
    return 28


async def react():
    llm = ChatOpenAI(model="Qwen/Qwen2.5-7B-Instruct", base_url="https://api.siliconflow.cn/v1",
                     api_key=SecretStr("sk-rcjroagmtltmudleqcpxrenfsqxbjeumpfhbbquveffgfrtr"), temperature=0)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """

        # 任务描述

        请根据用户问题选择合适工具分步骤解答和调用工具，必须严格遵循以下格式：

        # 响应格式
        问题：<input>
        思考：<分析问题并规划步骤>
        动作：@工具名(参数)
        输入：<具体参数值>
        观察：<工具返回结果>
        ...（循环N次）
        思考：现在可以给出最终答案
        最终结果：[答案需包含数据来源和推理过程]
        """),
        ("placeholder", "{messages}")
    ])
    agent = create_react_agent(model=llm, tools=[get_current_user, get_age_by_name], prompt=prompt, version="v2")

    async for chunk in agent.astream_events({"messages": [
        ("user", "请帮我查询我的年龄")
    ]}):
        print(chunk)

asyncio.run(react())
