# -*- coding: utf-8 -*-
# @Time    : 2025/4/8 13:59
# @Author  : liang
# @FileName: naocs.py.py
# @Software: PyCharm
from datetime import datetime
from enum import Enum

from flask import Flask
from flask.json.provider import DefaultJSONProvider
from pydantic import BaseModel
from sqlalchemy.orm import InstanceState

from app.database.database_settings import Base

# 序列化实例
_json_provider_instance = None

# 自定义序列化规则
def serialize(_, obj):
    if obj is None:
        return None
    if isinstance(obj, int):
        return str(obj)
    if isinstance(obj, InstanceState):
        return None
    if isinstance(obj, BaseModel):
        return obj.model_dump()
    if isinstance(obj, dict):
        return obj
    if isinstance(obj, Base):
        return obj.to_dict()
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, datetime):
        return obj.strftime("%Y-%m-%d %H:%M:%S")
    #没有找到序列化的类型，返回null字符
    return "null"


class BmosJSONProvider(DefaultJSONProvider):
    default = serialize
    ensure_ascii = False

def init_json_provider(app: Flask):
    """初始化自定义序列实例"""
    app.json = BmosJSONProvider(app)
    global _json_provider_instance
    _json_provider_instance = app.json


def get_json_serializer() -> BmosJSONProvider | None:
    """获取序列化实例"""
    return _json_provider_instance