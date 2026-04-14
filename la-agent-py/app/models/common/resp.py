# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:33
# @Author  : liang
# @FileName: resp.py
# @Software: PyCharm
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")

class Resp(BaseModel, Generic[T]):

    code: int = 0
    data: T
    message: str = "请求成功"


    @classmethod
    def success(cls, data: T = None):
        return {
            "code": 0,
            "data": data,
            "message": "请求成功"
        }

    @classmethod
    def fail(cls, message: str, data: T = None):
        return {
            "code": -1,
            "data": data,
            "message": message
        }

    @classmethod
    def error(cls, message: str, data: T = None):
        return {
            "code": 500,
            "data": data,
            "message": message
        }

    @classmethod
    def auth_fail(cls, message: str):
        return {
            "code": 401,
            "data": None,
            "message": message
        }


def to_dict(data):
    if data is None:
        return None
    if isinstance(data, BaseModel):
        return data.model_dump()
    if isinstance(data, dict):
        return data
    if isinstance(data, list):
        return [to_dict(item) for item in data]
    if not hasattr(data, "__dict__"):
        return data
    return data.__dict__