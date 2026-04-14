# -*- coding: utf-8 -*-
# @Time    : 2025/4/21 10:47
# @Author  : liang
# @FileName: page_sql_helper.py
# @Software: PyCharm
from typing import TypeVar

from sqlalchemy import text

from app.app_init import app

T = TypeVar("T")


def custom_sql_pagination(sql, cls: T, params=None, page=1, per_page=10) -> dict:
    """
    自定义sql分页
    :param sql: 自定义sql
    :param cls: 返回model
    :param params: sql参数
    :param page: 页码
    :param per_page: 分页大小
    :return: paginate 字典
    """
    # 计算总记录数
    count_sql = f"SELECT COUNT(*) AS total FROM ({sql}) AS subquery"
    total = app.db.session.execute(text(count_sql), params).scalar()

    # 分页数据查询
    offset = (page - 1) * per_page
    paginated_sql = f"{sql} LIMIT {per_page} OFFSET {offset}"
    items = app.db.session.execute(text(paginated_sql), params).mappings()
    # 构建分页对象
    return {
        'items': [cls(**item) for item in items],
        'page': page,
        'per_page': per_page,
        'total': total,
        'pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
