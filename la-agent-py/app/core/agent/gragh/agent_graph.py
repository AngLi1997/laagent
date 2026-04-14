import asyncio

from app.core.agent.gragh.llm_node import LLMNode
from langgraph.constants import START, END
from langgraph.graph import StateGraph

from app.core.agent.base_node import State
from app.core.agent.gragh.condition_node import ConditionNode
from app.core.agent.gragh.kb_node import KBNode
from app.core.agent.gragh.start_end_node import StartNode, EndNode
from app.exception.exception_handler import BmosException
from app.models.graph_model import GraphInfo
from app.models.graph_model import State


class _Edge:
    def __init__(self, from_node_id, to_node_id, edge_condition_node=None):
        self.from_node_id = from_node_id
        self.to_node_id = to_node_id
        self.edge_condition_node = edge_condition_node

class BmosAgent:
    def __init__(self, graph_info: GraphInfo, chat_id):
        self.la-agent-py = None
        self.graph_info = graph_info
        self.chat_id = chat_id
        self.node_dict = {}


    def chat_agent(self, variable_value: dict[str, str]):
        """
        启动angent
        param thread_id: 当前工作流的线程id
        param variable_value: 当前工作流中用户输入的变量以及变量值
        """
        graph_builder = StateGraph(State)
        node_dict = {node.node_id for node in self.graph_info.nodes}
        # 进行智能体编排
        start_node_id, end_node_id = None, None
        node_dict = {}
        for node in self.graph_info.nodes:
            node_dict[node.node_id] = node
            if node.node_type == NodeTypeEnum.START:
                start_node_id = node.node_id
                start_node = StartNode(node_info=node, env=self.graph_info.envs, variable_value=variable_value, chat_id=self.chat_id)
                graph_builder.add_node(node.node_id, start_node.node)
            elif node.node_type == NodeTypeEnum.LLM:
                llm_node = LLMNode(node_info=node, chat_id=self.chat_id)
                graph_builder.add_node(node.node_id, llm_node.node)
            elif node.node_type == NodeTypeEnum.KB:
                kb_node = KBNode(node_info=node, chat_id=self.chat_id)
                graph_builder.add_node(node.node_id, kb_node.node)
            elif node.node_type == NodeTypeEnum.END:
                end_node = EndNode(node_info=node, chat_id=self.chat_id)
                graph_builder.add_node(node.node_id, end_node.node)
                end_node_id = node.node_id
        # 边构建
        self.__build_edge(graph_builder, node_dict, start_node_id, end_node_id)
        self.la-agent-py = graph_builder.compile()
        print(self.la-agent-py.get_graph())
        asyncio.run(self.__invoke())

    def close(self):
        self.la-agent-py = None
        self.graph_info = None
        self.chat_id = None
        self.node_dict = {}

    async def __invoke(self):
        self.la-agent-py.invoke({"role": "user", "content": "开始执行图"})

    def __merge_edges(self, condition_nodes: set[str]) -> tuple[dict[str, list[_Edge]], list[_Edge]]:
        """
        获取node_id所有对应的下一个的边,
        此边需要进行变更 变更eg: A -> B -> C 若B为条件节点, 则需要剔除A -> B B->C这条边，然后新增A->C这条边，然后将A->C需要满足B的条件
        若有A -> B -> C ， 又有A -> C 这种情况 则C允许执行两次
        """
        edge_group = {}
        to_is_condition_edges: dict[str, list[Edge]] = {}
        from_condition_edges = []
        for edge in self.graph_info.edges:
            if edge.to_node in condition_nodes:
                if to_is_condition_edges.get(edge.to_node) is not None:
                    edge_group[edge.to_node].append(edge)
                else:
                    to_is_condition_edges[edge.to_node] = [edge]
                continue
            if edge.from_node in condition_nodes:
                from_condition_edges.append(edge)
            elif edge.to_node not in edge_group:
                edge_group[edge.to_node] = [_Edge(edge.from_node, edge.to_node)]
            else:
                edge_group[edge.to_node].append(_Edge(edge.from_node, edge.to_node))
        condition_edges = []
        for from_condition_edge in from_condition_edges:
            if from_condition_edge.from_node in to_is_condition_edges:
                for to_is_condition_edge in to_is_condition_edges[from_condition_edge.from_node]:
                    condition_edges.append(_Edge(to_is_condition_edge.from_node, from_condition_edge.to_node, from_condition_edge))
        return edge_group, condition_edges

    def __find_condition_nodes(self) -> set[str]:
        """寻找所有包含条件的节点"""
        result = set()
        for node in self.graph_info.nodes:
            if node.node_type == NodeTypeEnum.CONDITION:
                result.add(node.node_id)
        return result

    def __build_edge(self, graph_builder, node_dict, start_node_id, end_node_id):
        if start_node_id is None:
            raise BmosException("缺少开始节点")
        condition_nodes = self.__find_condition_nodes()
        edge_group, condition_edges = self.__merge_edges(condition_nodes)
        graph_builder.add_edge(START, start_node_id)
        for to_node, from_edges in edge_group.items():
            if to_node == start_node_id:
                graph_builder.add_edge(START, to_node)
                continue
            from_node_ids = [edge.from_node_id for edge in from_edges]
            graph_builder.add_edge(from_node_ids, to_node)
        graph_builder.add_edge(end_node_id, END)
        # 构建条件边
        if len(condition_edges) <= 0:
            return
        merge_condition_group = {}
        for condition_edge in condition_edges:
            merge_condition_group.setdefault(condition_edge.from_node_id, []).append(condition_edge)
        for from_node_id, condition_edges in merge_condition_group.items():
            merge_group = {}
            for condition_edge in condition_edges:
                merge_group.setdefault(condition_edge.edge_condition_node.from_node, []).append(condition_edge.edge_condition_node)
            for cur_condition_edge, edges in merge_group.items():
                to_node_ids = [edge.to_node for edge in edges]
                graph_builder.add_conditional_edges(from_node_id,
                                                     ConditionNode(node_info=node_dict[cur_condition_edge], edges=edges, chat_id=self.chat_id).node,
                                                         path_map=to_node_ids)




if __name__ == '__main__':
    from app.models.graph_model import *

    start_node_input = NodeInputOutput(param_name="start_node_input_param")
    start_node = NodeInfo(node_id="START_NODE_1", node_type=NodeTypeEnum.START, node_name="START_NODE_1", node_config=None,  inputs=[start_node_input], outputs=[], error_handle=NodeErrorHandle(type=NodeErrorHandleType.TERMINATE), output_to_user=False)

    kb_case_1_condition_1 = ConditionCaseCondition(id="kb_case_1_condition_1", variable_selector="${START_NODE_1.start_node_input_param}", operator=ConditionOperatorEnum.CONTAINS, value = "python", value_type=ValueType.VARIABLE_SELECTOR)
    kb_case_1_condition_2 = ConditionCaseCondition(id="kb_case_1_condition_2", variable_selector="${START_NODE_1.start_node_input_param}", operator=ConditionOperatorEnum.CONTAINS, value = "Python", value_type=ValueType.VARIABLE_SELECTOR)
    kb_case_1 = ConditionCase(id="kb_case_1", conditions=[kb_case_1_condition_1, kb_case_1_condition_2], logic="kb_case_1_condition_1||kb_case_1_condition_2")
    llm_case_1 = ConditionCase(id="llm_case_1")
    condition_inner_config = ConditionInnerConfig(cases=[kb_case_1, llm_case_1])
    condition_config = ConditionConfig(id="CONDITION_1", config=condition_inner_config)
    condition_node_1 = NodeInfo(node_id="CONDITION_1", node_type=NodeTypeEnum.CONDITION, node_name="CONDITION_1", node_config=condition_config, inputs=[], outputs=[], error_handle=NodeErrorHandle(type=NodeErrorHandleType.TERMINATE), output_to_user=False)

    kb_inner_config = KbInnerConfig(matching_type=MatchingType.VECTOR, rerank=True, score_threshold=0.5, top_k=10)
    kb_node_config = KBNodeConfig(config=kb_inner_config, id="1910329585308794880")
    kb_input_param = NodeInputOutput(input_type=NodeInputOutputTypeEnum.VARIABLE_SELECTOR, input_value="${START_NODE_1.start_node_input_param}", param_name="kb_input_query")
    kb_output_param = NodeInputOutput(param_name="kb_output_param")
    kb_node = NodeInfo(node_id="KB_NODE_1", node_type=NodeTypeEnum.KB, node_name="KB_NODE_1", node_config=kb_node_config, inputs=[kb_input_param], outputs=[kb_output_param], error_handle=NodeErrorHandle(type=NodeErrorHandleType.TERMINATE), output_to_user=False)

    llm_inner_config = LLMNodeInnerConfig(temperature=0.7, top_k=1, top_p=0.65)
    llm_node_config = LLMNodeConfig(config=llm_inner_config, id="LLM_NODE_CONFIG_1", prompts=[LLMPrompt(prompt="你是一个助手, 除了你自己有的知识，从额外知识库中获取到：${KB_NODE_1.kb_output_param}", type=LLMPromptType.SYSTEM), LLMPrompt(prompt="${START_NODE_1.start_node_input_param}", type=LLMPromptType.USER)])
    llm_node_output_param = NodeInputOutput(param_name="llm_node_output_param")
    llm_node = NodeInfo(node_id="LLM_NODE_1", node_type=NodeTypeEnum.LLM, node_name="LLM_NODE_1", node_config=llm_node_config, inputs=[], outputs=[llm_node_output_param], error_handle=NodeErrorHandle(type=NodeErrorHandleType.TERMINATE), output_to_user=True)

    end_node_output = NodeInputOutput(input_type=NodeInputOutputTypeEnum.VARIABLE_SELECTOR, input_value="${LLM_NODE_1.llm_node_output_param}", param_name="end_node_output_param")
    end_node = NodeInfo(node_id="END_NODE_1", node_type=NodeTypeEnum.END, node_name="END_NODE_1", node_config=None, inputs=[], outputs=[end_node_output], error_handle=NodeErrorHandle(type=NodeErrorHandleType.TERMINATE), output_to_user=True)

    kb_to_llm_edge = Edge(id= "kb_1_to_llm_1", from_node="KB_NODE_1", to_node="LLM_NODE_1")
    llm_to_end_edge = Edge(id= "llm_1_to_end_1", from_node="LLM_NODE_1", to_node="END_NODE_1")
    start_to_condition_edge = Edge(id= "start_to_condition_1", from_node="START_NODE_1", to_node="CONDITION_1")
    condition_to_llm_edge = Edge(id= "condition_1_to_llm_1", from_node="CONDITION_1", to_node="LLM_NODE_1", from_case="llm_case_1")
    condition_to_kb_edge = Edge(id= "condition_1_to_kb_1", from_node="CONDITION_1", to_node="KB_NODE_1", from_case="kb_case_1")
    graph_info = GraphInfo(nodes=[start_node, kb_node, llm_node, end_node, condition_node_1],
                           edges=[start_to_condition_edge, kb_to_llm_edge, llm_to_end_edge,  condition_to_llm_edge, condition_to_kb_edge])

    la-agent-py = BmosAgent(graph_info, "chat_1")
    # la-agent-py.chat_agent({"start_node_input_param": "Python是什么"})
    la-agent-py.chat_agent({"start_node_input_param": "我是谁"})
    # la-agent-py.chat_agent({"start_node_input_param": "Python与java有什么区别"})