from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class MenuQueryRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    contains_func: str | bool | None = Field(default=None, alias='containsFunc', description='是否包含功能按钮')
    root_menu_code: str | None = Field(default=None, alias='rootMenuCode', description='根菜单编码或菜单标识')
    terminal_type: int | None = Field(default=None, alias='terminalType', description='终端类型')


class MenuNode(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(description='兼容前端的菜单标识')
    code: int = Field(description='归一化菜单编码')
    parentId: str | None = Field(default=None, description='父级菜单标识')
    name: str = Field(description='菜单名称')
    menuType: Literal['ROOT', 'MENU', 'PAGE', 'FUNC'] = Field(description='菜单类型')
    path: str | None = Field(default=None, description='菜单路径')
    component: str | None = Field(default=None, description='组件路径')
    icon: str | None = Field(default=None, description='菜单图标')
    sortNo: int = Field(default=0, description='排序号')
    terminalType: int = Field(default=1, description='终端类型')
    isOutside: int = Field(default=0, description='是否外链')
    hidden: int = Field(default=0, description='是否隐藏')
    children: list['MenuNode'] = Field(default_factory=list, description='子菜单')


MenuNode.model_rebuild()
