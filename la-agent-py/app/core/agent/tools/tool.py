# -*- coding: utf-8 -*-
# @Time    : 2025/4/29 20:48
# @Author  : liang
# @FileName: tool.py
# @Software: PyCharm
from flask_sqlalchemy.session import Session
from pydantic import BaseModel

from app.entities.tool import BaTool


class ToolInfo(BaseModel):
    tool_id: str | int
    tool_name: str | int

def get_tool_by_id(tool_id: str) -> ToolInfo | None:
    """根据id查询工具信息"""
    from app.app_init import app
    with app.app_context():
        with Session(app.db):
            tool = BaTool.query.get(tool_id)
            if not tool:
                return None
            return ToolInfo(tool_id=tool.id, tool_name=tool.name)