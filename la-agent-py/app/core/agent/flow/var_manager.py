# -*- coding: utf-8 -*-
# @Time    : 2025/4/27 16:25
# @Author  : liang
# @FileName: var_manager.py
# @Software: PyCharm

"""运行时变量管理器"""

import re
from typing import Dict, Any

from pydantic import BaseModel


class VarManager(BaseModel):
    """变量管理器"""
    _vars: Dict[str, Dict[str, Any]] = {}

    def get_vars(self, node_name=None) -> Dict[str, Any]:
        """获取变量"""
        if node_name:
            return self._vars.get(node_name, {})
        return self._vars

    def get_vars_param_dict(self) -> Dict[str, str]:
        """获取变量字典"""
        result = {}
        for node_name, dct in self._vars.items():
            for param_name, value in dct.items():
                result.setdefault(f"{node_name}.{param_name}", str(value))
        return result

    def update(self, node_name: str, var_name: str, value: Any) -> None:
        """更新变量"""
        if node_name not in self._vars:
            self._vars[node_name] = {}
        self._vars[node_name][var_name] = value

    def get_value(self, node_name: str, var_name: str) -> Any:
        """获取变量值"""
        return self._vars.get(node_name, {}).get(var_name)

    def get_value_by_param(self, param: str) -> Any:
        """通过参数获取变量值"""
        if "." in param:
            node_name, var_name = param.split(".")
            return self._vars.get(node_name, {}).get(var_name)
        return self._vars.get(param, {}).get(param)

    def merge(self, other: 'VarManager') -> 'VarManager':
        """合并两个变量管理器"""
        self._vars = {**self._vars, **other._vars}
        return self


def fill_var(resource_data: str, split_content: Dict[str, str]) -> str:
    """
    填充变量
    :param resource_data: 被替换的原数据
    :param split_content: 需要替换的内容字典
    """
    if not resource_data:
        return ""

    matches = re.findall(r"(?<=\$\{).*?(?=})", resource_data)  # 提取需要替换的目标

    new_data = resource_data  # 替换后的数据
    for i in matches:  # 替换过程
        new_value = split_content.get(i, "")
        if i == matches[0]:
            new_data = resource_data.replace("${" + i + "}", str(new_value))
        else:
            new_data = new_data.replace("${" + i + "}", str(new_value))
    return new_data.replace("\n", " ")

def merge_var_manager(vm1: VarManager, vm2: VarManager) -> VarManager:
    """合并两个变量管理器"""
    vm1 = vm1.merge(vm2)
    return vm1