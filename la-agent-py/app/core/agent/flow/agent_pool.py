# -*- coding: utf-8 -*-
# @Time    : 2025/4/28 21:45
# @Author  : liang
# @FileName: agent_pool.py
# @Software: PyCharm
from langgraph.graph.state import CompiledStateGraph

from app.entities.agent import BaAgent


class AgentPool:
    """智能体池"""
    __agent_pool: dict[str, CompiledStateGraph] = {

    }

    def register_agent_graph(self, agent_id: str, agent: CompiledStateGraph) -> None:
        """注册智能体"""
        self.__agent_pool[agent_id] = agent


    def get_agent_graph(self, agent_id: str) -> CompiledStateGraph:
        """获取智能体"""
        graph = self.__agent_pool.get(agent_id)
        if graph:
            return graph
        ba_agent = BaAgent.query.get(agent_id)
        if ba_agent:
            from app.core.agent.flow.agent_context import load_json_config, complete_agent
            config = load_json_config(ba_agent.args)
            graph = complete_agent(config)
            self.register_agent_graph(ba_agent.id, graph)
        return graph

    def remove_agent_graph(self, agent_id: str) -> None:
        """移除智能体"""
        if agent_id in self.__agent_pool:
            del self.__agent_pool[agent_id]


agent_pool = AgentPool()