# -*- coding: utf-8 -*-
# @Time    : 2025/4/3 14:24
# @Author  : liang
# @FileName: tree_util.py
# @Software: PyCharm
"""树节点工具"""
from typing import Union

from pydantic import Field, BaseModel


class BmosTreeNode(BaseModel):
    id: Union[str, int] = Field(description='文档分类id')
    name: str = Field(description='文档分类名称')
    parent_id: Union[str, int] | None = Field(None, description='父级分类id')
    children: list["BmosTreeNode"] | None = Field([], description='子分类')

BmosTreeNode.model_rebuild()


def build_tree(nodes: list[BmosTreeNode], parent_id: str | None = None) -> list[BmosTreeNode]:
    """
    构建树形结构
    :param nodes: 节点列表
    :param parent_id: 父级节点id
    :return: 树形结构
    """
    tree = []
    for node in nodes:
        if node.parent_id == parent_id:
            node.children = build_tree(nodes, node.id)
            tree.append(node)
    return tree