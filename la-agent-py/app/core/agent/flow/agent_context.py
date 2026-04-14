# -*- coding: utf-8 -*-
# @Time    : 2025/4/27 10:54
# @Author  : liang
# @FileName: agent_context.py
# @Software: PyCharm
import json
from typing import TypedDict, Annotated

from langchain_core.language_models import BaseChatModel
from langgraph.graph import add_messages
from langgraph.graph.state import CompiledStateGraph, StateGraph
from langgraph.types import StreamWriter
from loguru import logger

from app.core.agent.flow.graph_components import GraphConfig, BaseNode, LLMNode, LLMNodeConfig, Edge, ToolNode, \
    ConditionNode, \
    KnowledgeBaseNode, ToolNodeConfig, ToolConfig, ToolConfigParam, KnowledgeBaseNodeConfig, \
    KnowledgeBaseRetrievalConfig
from app.core.agent.flow.memory_manager import memory_manager
from app.core.agent.flow.re_act import re_act
from app.core.agent.flow.var_manager import VarManager, fill_var, merge_var_manager
from app.core.agent.knowledge.document.document import retrieval_chunks_with_kb_ids
from app.core.agent.messages.messages import TextMessage, DocumentLinkMessage, ToolCallingMessage, ToolResultMessage
from app.exception.exception_handler import BmosException
from app.models.document import DocumentRetrievalChunk
from app.models.tool import ToolInvokeRequest, ToolInfo
from app.utils.snowflake import IdUtil


class State(TypedDict):
    input: str
    """输入参数: 节点名称->变量名 """
    search_results: list
    """联网搜索结果"""
    vm: Annotated[VarManager, merge_var_manager]
    """运行变量"""
    messages: Annotated[list, add_messages]
    """消息历史"""


def load_json_config(json_str: str) -> GraphConfig | None:
    """加载json配置"""
    if not json_str:
        return None
    try:
        config = GraphConfig.model_validate_json(json_str)
    except Exception as e:
        logger.error(e)
        raise BmosException('配置错误, 请检查配置')

    node_names = [n["node_name"] for n in config.nodes]
    if len(node_names) != len(set(node_names)):
        raise BmosException('节点名称重复')
    # 校验name包含小数点
    for node in config.nodes:
        if "." in node["node_name"]:
            raise BmosException('节点名称不能包含小数点')
    return config


def complete_agent(config: GraphConfig) -> CompiledStateGraph:
    """编译agent"""

    logger.info(f'开始编译智能体graph...')

    builder = StateGraph(State)

    """节点"""
    for node in config.nodes:
        _add_graph_node(builder, node)

    """设置出入口"""
    start, end = config.get_endpoints()
    builder.set_entry_point(start)
    builder.set_finish_point(end)

    condition_edges: dict[str, list] = {}
    """边"""
    for edge in config.edges:
        if edge.get('from_case'):
            # 条件边 合并条件
            condition_edges.setdefault(edge.get('from_node'), []).append(edge)
        else:
            _add_graph_edge(builder, edge)
    """条件边（需要合并 所以单独处理）"""
    _add_graph_condition_edges(builder, condition_edges, end)

    g = builder.compile(checkpointer=memory_manager.get_check_point())

    logger.info(f'编译智能体graph完成...')
    g.get_graph().print_ascii()
    return g


def _embedding_vars(vm, node: BaseNode):
    """嵌入变量"""
    for node_input in node.inputs:
        if node_input.input_type == "variable_selector":
            vm.update(node.node_name, node_input.param_name, vm.get_value_by_param(node_input.input_value))
        else:
            vm.update(node.node_name, node_input.param_name, node_input.input_value)

def _add_graph_node(graph_builder: StateGraph, node_dct: dict):
    """添加节点"""

    logger.info(f'构建节点:{node_dct["node_name"]}')

    if node_dct['node_type'] == "start":
        """
            开始节点
            节点逻辑：无特殊逻辑，输入即输出
        """
        node = BaseNode(**node_dct)

        # @error_catcher
        def graph_node(state: State):
            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            # 初始化变量管理器
            vm = VarManager()
            state.setdefault("vm")
            vm.update(node.node_name, "input", state["input"])
            vm.update(node.node_name, "output", state["input"])
            return {"vm": vm}

        graph_builder.add_node(node.node_name, graph_node)

    elif node_dct['node_type'] == "llm":
        """
            llm节点
            节点逻辑：
                根据节点的输入信息，填充大模型配置的系统提示词模板，通知大模型生成响应
                大模型响应信息会绑定到变量{node_name.output}中
        """

        node = LLMNode(**node_dct)
        node_config: LLMNodeConfig = node.node_config
        llm = _get_llm(node_config.id)

        # @error_catcher
        def graph_node(state: State, writer: StreamWriter):
            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            vm = state["vm"]
            # 嵌入变量
            _embedding_vars(vm, node)
            # 设置提示词
            prompts_configs = node_config.prompts
            tool_ids = node_config.tool_ids

            latest_question = ""
            if state["search_results"]:
                state["messages"].append({"role": "system", "content": f'联网搜索结果: {state["search_results"]}'})
            for prompts_config in prompts_configs:
                content = fill_var(prompts_config.prompt, vm.get_vars_param_dict())
                if prompts_config.type == "system":
                    state["messages"].append({"role": "system", "content": content})
                elif prompts_config.type == "user":
                    state["messages"].append({"role": "human", "content": content})
                    latest_question = content
            resp = ""
            logger.info(f'提示消息列表:{state["messages"]}')

            if not tool_ids:
                """这里走的是普通llm逻辑"""
                for ck in llm.stream(state["messages"]):
                    resp += ck.content.replace("\n", "")
                    if node.output_to_user:
                        writer(TextMessage(content=ck.content, node_id=node.node_id))
            else:
                """
                这里走的是可以自己调用工具的智能体逻辑
                使用 re_act / plan-and-execute 架构
                """
                resp = re_act(llm, latest_question, node, tool_ids, writer, state["search_results"])
            vm.update(node.node_name, "output", resp)
            return {"vm": vm, "messages": [{"role": "ai", "content": resp if resp else " "}]}
        graph_builder.add_node(node.node_name, graph_node)

    elif node_dct['node_type'] == "tool":
        """
            工具节点
            节点逻辑：
                节点入参作为工具入参
                工具调用结果会绑定到变量{node_name.output}中
        """
        node = ToolNode(**node_dct)
        node_config: ToolNodeConfig = node.node_config

        # @error_catcher
        def graph_node(state: State, writer: StreamWriter):

            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            vm = state["vm"]
            _embedding_vars(vm, node)

            # 工具调用
            logger.info(f'工具调用 id:{node_config.id}, name={node_config.tool_name}')

            calling_key = IdUtil.generate_id()

            tool = _get_tool(node_config.id)
            final_name = node_config.tool_name if node_config.tool_name else tool.tool_name

            tool_config: ToolConfig = node_config.config
            config_params: list[ToolConfigParam] | None = tool_config.tool_params

            params = {}

            for config_param in config_params:
                if config_param.type == "variable_selector":
                    params[config_param.name] = vm.get_value_by_param(config_param.value)
                elif config_param.type == "string":
                    params[config_param.name] = str(config_param.value)
                elif config_param.type == "number":
                    params[config_param.name] = float(config_param.value)
                elif config_param.type == "bool":
                    params[config_param.name] = bool(config_param.value)

            logger.info(f'工具调用请求参数：{params}')

            if node.output_to_user:
                writer(ToolCallingMessage(node_id=node.node_id, key=calling_key, tool_id=node_config.id, tool_name=final_name,
                                          tool_param=params))

            trm = ToolResultMessage(node_id=node.node_id, tool_calling_key=calling_key, tool_id=node_config.id, tool_name=final_name,
                                    tool_param=params)

            from app.blueprints.tool_blueprint import tool_invoke

            res = None
            try:

                res = tool_invoke(ToolInvokeRequest(tool_id=node_config.id, arguments={
                    "tool_name": node_config.tool_name,
                    "argument": json.dumps(params)
                }))
                logger.info(f'工具调用结果:{res}')
                trm.result = res["data"]
                if res["code"] != 0:
                    trm.error_msg = res.message
            except Exception as e:
                logger.error(f'工具调用异常:{e}')
                trm.error_msg = str(e)
            finally:
                if node.output_to_user:
                    writer(trm)
                vm.update(node.node_name, "output", res)
            return {"vm": vm}

        graph_builder.add_node(node.node_name, graph_node)

    elif node_dct['node_type'] == "kb":
        """
            知识库节点
            节点逻辑:
                节点入参作为召回文本
                出参：满足条件的文本段
        """
        node = KnowledgeBaseNode(**node_dct)

        # @error_catcher
        def graph_node(state: State, writer: StreamWriter):
            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            vm = state["vm"]
            _embedding_vars(vm, node)
            node_config: KnowledgeBaseNodeConfig = node.node_config
            kb_config = node_config.config
            res = _kb_retrieval(node_config.id, vm.get_value(node.node_name, "input"), kb_config)
            if node.output_to_user:
                for kb_chunk in res:
                    writer(DocumentLinkMessage(knowledge_base_name=kb_chunk.knowledge_base_name,
                                               document_name=kb_chunk.document_name,
                                               document_url=kb_chunk.document_source_url,
                                               document_chunk_content=kb_chunk.content, node_id=node.node_id))
            data = "".join([f'{kb_chunk.document_name} - {kb_chunk.content}\n' for kb_chunk in res])
            vm.update(node.node_name, "output", f'{data}')
            return {"vm": vm}

        graph_builder.add_node(node.node_name, graph_node)

    elif node_dct['node_type'] == "condition":
        """
            条件节点
            节点逻辑:
                节点入参作为变量，填充所有case表达式
                出参: 满足的条件case
        """
        node = ConditionNode(**node_dct)

        # @error_catcher
        def graph_node(state: State, writer: StreamWriter):
            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            vm = state["vm"]
            _embedding_vars(vm, node)

            node_config = node.node_config
            selected_case_id = None

            for case in node_config.cases:
                # 如果没有条件，则作为默认case
                logger.info(f'{case.key}:')
                if not case.conditions:
                    logger.info(f'  - else')
                for condition in case.conditions:
                    logger.info(f'  - {condition}:')
                logger.info(f'  - {case.logic}')

                if not case.conditions:
                    selected_case_id = case.key
                    break

                # 评估所有条件
                condition_results = {}
                for condition in case.conditions:
                    # 获取变量值
                    var_value = vm.get_value_by_param(condition.variable_selector)
                    # 获取比较值
                    compare_value = condition.value
                    if condition.value_type == "variable_selector":
                        compare_value = vm.get_value_by_param(condition.value)
                    # 开始比较
                    result = False
                    if condition.operator == "is":
                        result = str(var_value) == str(compare_value)
                    elif condition.operator == "not":
                        result = str(var_value) != str(compare_value)
                    elif condition.operator == "contains":
                        result = str(compare_value) in str(var_value)
                    elif condition.operator == "not_contains":
                        result = str(compare_value) not in str(var_value)
                    elif condition.operator == "is_null":
                        result = var_value is None
                    elif condition.operator == "not_null":
                        result = var_value is not None
                    condition_results[condition.key] = result

                # 逻辑表达式
                if case.logic:
                    # 简单的逻辑表达式处理
                    if case.logic in condition_results and condition_results[case.logic]:
                        selected_case_id = case.key
                        break
                else:
                    # 如果没有指定逻辑，则所有条件都需要满足
                    if all(condition_results.values()):
                        selected_case_id = case.key
                        break

            # 将选择的case_id保存到变量中
            vm.update(node.node_name, "output", selected_case_id)
            logger.info(f'条件节点执行结果：{selected_case_id}')
            return {"vm": vm}

        graph_builder.add_node(node.node_name, graph_node)

    else:
        """其他节点（结束节点）"""
        node = BaseNode(**node_dct)

        # @error_catcher
        def graph_node(state: State):
            logger.info(f'{node.node_type}节点{node.node_name}开始执行...')
            vm = state["vm"]
            return {"vm": vm}

        graph_builder.add_node(node.node_name, graph_node)


def _add_graph_edge(graph_builder: StateGraph, edge_dct: dict):
    """添加普通边"""
    edge = Edge(**edge_dct)
    graph_builder.add_edge(edge.from_node, edge.to_node)


def _add_graph_condition_edges(graph_builder: StateGraph,
                               condition_edges: dict[str, list], end: str):
    """
    添加条件边
    Args:
        :param graph_builder: 图构建器
        :param condition_edges: 条件边字典，key为条件节点ID，value为该节点的所有条件边列表
        :param end: 结束节点
    """
    for node_name, case_edges in condition_edges.items():
        logger.info(f'条件节点{node_name}开始添加条件边...')
        for case_edge in case_edges:
            logger.info(f'  - 条件边{case_edge}')

        def condition(state: State):
            vm = state["vm"]
            # 获取条件节点的输出值（即执行结束后的的case_id）
            selected_case_id = vm.get_value_by_param(f"{node_name}.output")
            # 获取条件节点配置
            for c in case_edges:
                if c["from_case"] == selected_case_id:
                    logger.info(f'  - 执行条件边 跳转到节点{c["to_node"]}')
                    return c["to_node"]
            # 如果没有匹配的case 直接跳转到结束
            if case_edges:
                logger.info(f'  - 没有匹配的case，跳转到结束节点')
                return end
            # 如果没有任何case，返回结束节点
            logger.info(f'  - 没有匹配的case，跳转到结束节点')
            return end

        graph_builder.add_conditional_edges(node_name, condition)


def _get_llm(llm_id: str) -> BaseChatModel:
    """根据id查询大模型信息"""
    from app.core.agent.llm.llm import get_llm_by_id
    return get_llm_by_id(llm_id)


def _get_tool(tool_id: str) -> ToolInfo | None:
    """根据id查询工具信息"""
    from app.core.agent.tools.tool import get_tool_by_id
    return get_tool_by_id(tool_id)


def _kb_retrieval(kb_id: str, text: str, kb_config: KnowledgeBaseRetrievalConfig | None) -> list[DocumentRetrievalChunk]:
    if not text:
        return []
    """根据id查询知识库信息"""
    if kb_config:
        return retrieval_chunks_with_kb_ids([kb_id], text, kb_config.matching_type, kb_config.top_k, kb_config.score_threshold, kb_config.rerank)
    else:
        return retrieval_chunks_with_kb_ids([kb_id], text)
