from loguru import logger

from app.core.agent.base_node import BmosNode, State
from app.core.agent.gragh.case_parser import cal_condition, cal_case
from app.core.agent.gragh.variable_parser import parse_variable, find_variable
from app.exception.exception_handler import BmosException
from app.models.graph_model import Edge, NodeInfo


def _case(cases, state: State) -> str | None:
    """
    条件判断
    param cases: 所需要判断的条件
    return str: 返回一个对应的条件id
    """
    else_case_id = None
    for case in cases:
        if case.conditions is None or len(case.conditions) < 1:
            else_case_id = case.id
            continue
        condition_name_dict = {}
        for condition in case.conditions:
            if not condition.variable_selector:
                continue
            variables = parse_variable(condition.variable_selector)
            if variables is None or len(variables) < 1:
                continue
            condition_variable = find_variable(state.variables, variables[0])
            condition_name_dict[condition.id] = cal_condition(condition.value, condition_variable.value if condition_variable else None, condition.operator)
        if cal_case(case.logic, condition_name_dict):
            return case.id
    return else_case_id


class ConditionNode(BmosNode):

    def __init__(self, node_info: NodeInfo, edges: list[Edge], chat_id):
        """
        param edges: 代表当前节点连接所有下一个节点的边
        """
        super().__init__(node_info, chat_id)
        self.edges = edges

    def node(self, state: State, config: dict):
        logger.info(f"【{self.node_info.node_name}】条件节点运行开始...")
        # 根据条件判断需要执行哪一个节点
        inner_config = self.node_info.node_config.config
        case_id = _case(inner_config.cases, state)
        if case_id is None:
            raise BmosException("条件节点必须配置一个条件")
        logger.info(f"【{self.node_info.node_name}】条件节点判断完成 被判断成功的case_id为{case_id}")
        node_id_list = self.__case_node(case_id)
        logger.info(f"【{self.node_info.node_name}】条件节点运行结束 当前调节运行到下一个节点为={node_id_list}")
        return node_id_list

    def __case_node(self, case_id) -> list[str]:
        """根据所判断出的case_id 返回对应的节点id"""
        node_id_list = []
        for edge in self.edges:
            if edge.from_case == case_id:
                node_id_list.append(edge.to_node)
        return node_id_list