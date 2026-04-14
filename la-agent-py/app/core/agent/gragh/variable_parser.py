import json
import re

from app.core.agent.base_node import StateVariable

"""变量解析工具"""

def parse_variable(text: str) -> list[str]:
    """通过正则从字符串中解析出所有以解析出${}包裹的字符串"""
    pattern = r'\$\{(.*?)\}'
    matches = re.findall(pattern, text)
    return [match for match in matches]

def find_variable(variables: list[StateVariable],  variable_name) -> StateVariable | None:
    for variable in variables:
        if variable.node_variable_name == variable_name:
            return variable
    return None

def serialize_variable_value(variable: StateVariable) -> str:
    """将变量列表转换为字典"""
    if variable is None:
        return ""
    if isinstance(variable.value, str):
        return variable.value
    return json.dumps(variable.value,  ensure_ascii=False)