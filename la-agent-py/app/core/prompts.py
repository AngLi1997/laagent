# -*- coding: utf-8 -*-
# @Time    : 2025/5/9 12:24
# @Author  : liang
# @FileName: prompts.py
# @Software: PyCharm
RE_ACT_AGENT = """
Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}"""


RECOMMENDED_QUESTIONS = """
                你是一个问题预测助手，将用户的输入问题生成最多三个相关问题
                1、用户将提供一条文本，您将生成用户的文本推测可能会提出的问题列表。
                2、这些问题应与文本有直接关联。
                3、确保问题的实用性，不要生成实用性过低的问题，语言要通顺
                4、严格遵守！输出的格式为：
                ["question1", "question2"...]
                必须放在同一个列表中
                """