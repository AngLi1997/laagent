import ast
import operator

from app.constants.constants.graph_contants import LOGIC_AND_CONVERT, LOGIC_AND, LOGIC_OR_CONVERT, LOGIC_OR
from app.constants.enums.graph_enums import ConditionOperatorEnum

# 定义变量
A = True
B = False
C = True

# 定义支持的操作符
operators = {
    ast.And: operator.and_,
    ast.Or: operator.or_
}

class Evaluator(ast.NodeVisitor):
    def __init__(self, variables):
        self.variables = variables

    def visit_Expr(self, node):
        return self.visit(node.value)

    def visit_BoolOp(self, node):
        op_type = type(node.op)
        values = [self.visit(value) for value in node.values]
        if op_type == ast.And:
            return all(values)
        elif op_type == ast.Or:
            return any(values)
        else:
            raise TypeError("Unsupported operation")

    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)
        op_type = type(node.op)
        if op_type == ast.Not:
            return not operand
        else:
            raise TypeError("Unsupported operation")

    def visit_Compare(self, node):
        left = self.visit(node.left)
        for op, right in zip(node.ops, node.comparators):
            right = self.visit(right)
            if isinstance(op, ast.Eq):
                left = left == right
            elif isinstance(op, ast.NotEq):
                left = left != right
            elif isinstance(op, ast.Lt):
                left = left < right
            elif isinstance(op, ast.LtE):
                left = left <= right
            elif isinstance(op, ast.Gt):
                left = left > right
            elif isinstance(op, ast.GtE):
                left = left >= right
            else:
                raise TypeError("Unsupported operation")
        return left

    def visit_Name(self, node):
        if self.variables.get(node.id):
            return self.variables[node.id]
        return False

    def visit_NameConstant(self, node):
        return node.value

    def visit_Num(self, node):
        return node.n

    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)
        op_type = type(node.op)
        if op_type in operators:
            return operators[op_type](left, right)
        else:
            raise TypeError("Unsupported operation")

def evaluate_expression(expression, variables):
    tree = ast.parse(expression, mode='eval')
    evaluator = Evaluator(variables)
    return evaluator.visit(tree.body)


def cal_case(logic: str, variables: dict[str: bool]) -> bool:
    """根据条件表达时计算 执行表达式"""
    expression = logic.replace(LOGIC_AND, LOGIC_AND_CONVERT)
    expression = expression.replace(LOGIC_OR, LOGIC_OR_CONVERT)
    # 使用 ast 计算表达式
    return evaluate_expression(expression, variables)

def cal_condition(value:str, target: str, symple: str) -> bool:

    if ConditionOperatorEnum.IS == symple:
        if target is None or value is None:
            return False
        return value == target
    elif ConditionOperatorEnum.NOT == symple:
        if target is None or value is None:
            return False
        return value != target
    if ConditionOperatorEnum.IS_NULL == symple:
        return value is None
    if ConditionOperatorEnum.NOT_NULL == symple:
        return value is not None
    if ConditionOperatorEnum.CONTAINS == symple:
        if target is None or value is None:
            return False
        return target in value or value in target
    if ConditionOperatorEnum.NOT_CONTAINS == symple:
        if target is None or value is None:
            return False
        return target not in value and value not in target
    else :
        return False
