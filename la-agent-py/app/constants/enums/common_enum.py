# -*- coding: utf-8 -*-
# @Time    : 2025/4/3 14:58
# @Author  : liang
# @FileName: common_enum.py
# @Software: PyCharm

"""公共枚举类"""
from enum import Enum


class EnableStatus(Enum):
    """启用状态枚举"""
    # 启用
    ENABLE = "ENABLE"
    # 禁用
    DISABLE = "DISABLE"