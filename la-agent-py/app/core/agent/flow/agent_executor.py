# -*- coding: utf-8 -*-
# @Time    : 2025/5/7 11:13
# @Author  : liang
# @FileName: agent_executor.py
# @Software: PyCharm

from typing import List

from langchain.agents import StructuredChatAgent, AgentExecutor
from langchain_core.language_models import BaseLanguageModel
from langchain_core.tools import BaseTool
from langchain_experimental.plan_and_execute.executors.base import ChainExecutor


def custom_load_agent_executor(
        llm: BaseLanguageModel,
        tools: List[BaseTool],
        verbose: bool = False,
        include_task_in_prompt: bool = False,
) -> ChainExecutor:
    """
    Load an agent executor.

    Args:
        llm: BaseLanguageModel
        tools: List[BaseTool]
        verbose: bool. Defaults to False.
        include_task_in_prompt: bool. Defaults to False.

    Returns:
        ChainExecutor
    """
    input_variables = ["previous_steps", "current_step", "agent_scratchpad"]
    template = """Previous steps: {previous_steps}

Current objective: {current_step}

{agent_scratchpad}"""

    if include_task_in_prompt:
        input_variables.append("objective")
        template = """{objective}

        """ + template

    agent = StructuredChatAgent.from_llm_and_tools(
        llm,
        tools,
        human_message_template=template,
        format_instructions="""Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

Valid "action" values: "Final Answer" or {tool_names}

Provide only ONE action per $JSON_BLOB, as shown:

```
{{{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}}}
```

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
```
$JSON_BLOB
```
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
```
{{{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}}}
```""",
        input_variables=input_variables,
    )
    agent_executor = AgentExecutor.from_agent_and_tools(
        agent=agent, tools=tools, verbose=verbose
    )
    return ChainExecutor(chain=agent_executor)