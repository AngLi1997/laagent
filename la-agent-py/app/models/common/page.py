# -*- coding: utf-8 -*-
# @Time    : 2025/4/8 17:53
# @Author  : liang
# @FileName: page.py
# @Software: PyCharm
from typing import TypeVar

from flask_sqlalchemy.pagination import Pagination
from pydantic import BaseModel, Field
from typing_extensions import Generic

T = TypeVar("T")


class PageRequest(BaseModel):
    """分页请求基类"""
    page_num: int = Field(1, description='页码')
    page_size: int = Field(10, description='每页数量')


class PageResponse(BaseModel, Generic[T]):
    """分页响应"""
    total: int = Field(0, description='总数量')
    page_num: int = Field(1, description='页码')
    page_size: int = Field(10, description='每页数量')
    data: list[T] = Field(description='数据')
    total_page: int = Field(0, description='总页数')

    def __init__(self, page: Pagination | dict):
        if isinstance(page, dict):
            super().__init__(
                total=page['total'],
                page_num=page['page'],
                page_size=page['per_page'],
                data=page['items'],
                total_page=page['total'] // page['per_page'] + (1 if page['total'] % page['per_page'] else 0)
            )
            return
        super().__init__(
            total=page.total,
            page_num=page.page,
            page_size=page.per_page,
            data=page.items,
            total_page= page.total // page.per_page + (1 if page.total % page.per_page else 0)
        )
