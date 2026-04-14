# -*- coding: utf-8 -*-
# @Time    : 2025/4/9 11:22
# @Author  : liang
# @FileName: knowledge_enum.py
# @Software: PyCharm
"""文档知识库枚举类"""
from enum import Enum


class MatchingType(Enum):
    """文本匹配方式"""
    # 向量匹配
    VECTOR = "VECTOR"
    # 模糊匹配（全文搜索）
    FUZZY = "FUZZY"