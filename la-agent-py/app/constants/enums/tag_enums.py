# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 10:39
# @Author  : liang
# @FileName: knowledge_enum.py
# @Software: PyCharm
from enum import Enum


class TagType(Enum):
    """标记类型"""
    # 点赞
    LIKE = "LIKE"
    # 点踩
    DISLIKE = "DISLIKE"
