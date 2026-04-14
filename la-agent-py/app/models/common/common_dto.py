# -*- coding: utf-8 -*-
# @Time    : 2025/4/8 21:24
# @Author  : liang
# @FileName: common_dto.py
# @Software: PyCharm
from pydantic import BaseModel, Field

class IdDTO(BaseModel):
    id: str = Field(description='id')