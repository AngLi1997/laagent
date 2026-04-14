# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:33
# @Author  : liang
# @FileName: agent.py
# @Software: PyCharm
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, Field

from app.constants.enums.tool_enum import ToolType, HttpMethod, ContentType, ParamType
from app.models.common.page import PageRequest


class ToolRequest(BaseModel):
    id: str = Field('id',description="id")
    name: str = Field('工具名称',description="工具名称")
    type: ToolType = Field('工具类型',description="工具类型(MCP/PYTHON/REST)")
    description: str = Field('工具描述',description="工具描述")
    attribute: str = Field('类型属性值',description="属性")
    dept_ids: list[str | int] = Field(description='部门id列表')

class ToolQueryRequest(PageRequest):
    name: Optional[str] = Field(None, description="工具名称模糊查询")

class ToolQueryResponse(BaseModel):
    id: str = Field('id',description="id")
    name: str = Field("工具名称",description="工具名称")
    type: str = Field("工具类型",description="工具类型")
    description: str = Field("工具描述",description="工具描述")
    attribute: str = Field("属性",description="属性")
    update_time: Optional[datetime] = None
    update_user: Optional[str] = None

# 参数和响应字段模型
@dataclass
class FieldDefinition(BaseModel):
    name: str
    description: str
    paramType: ParamType
    example: Optional[Any] = None
    required: bool = False
    key: str = Field(description="参数id")

# 完整的请求对象
@dataclass
class ApiRequest(BaseModel):
    # 响应字段定义
    response_fields: str = Field('响应实例',description="响应实例")
    method: HttpMethod = Field('请求方式',description="请求方式（GET、POST、PUT、DELETE）")
    content_type: ContentType = Field('内容类型',description="内容类型（application/json、application/x-www-form-urlencoded、multipart/form-data）")
    url: str = Field('请求路径',description="请求路径")

    # 参数定义 (GET参数或请求体参数)
    params: List[FieldDefinition] = field(default_factory=list)

    # 实际请求数据 (运行时填充)
    request_data: Optional[Dict[str, Any]] = None

    # # 额外头信息
    headers: Dict[str, str] = field(default_factory=lambda: {
        "User-Agent": "PythonAPIClient/1.0"
    })

    def validate_param(self):
        """验证必填参数是否提供"""
        if self.request_data is None:
            return True

        missing = [
            p.name for p in self.params
            if p.required and p.name not in self.request_data
        ]
        if missing:
            raise ValueError(f"缺少必填参数: {', '.join(missing)}")


class ToolResponse(BaseModel):
    id: str = Field('id', description="id")
    name: str = Field("工具名称", description="工具名称")
    type: str = Field("工具类型", description="工具类型")
    description: str = Field("工具描述", description="工具描述")
    restAttr: ApiRequest = None
    mcpAttr: str = None
    dept_ids: list = Field(description="数据所属部门")

import requests
from typing import Dict, Any

def execute_api_request(api_request: ApiRequest) -> Dict[str, Any]:
    """
    根据ApiRequest对象执行HTTP请求

    Args:
        api_request: 包含请求所有信息的对象

    Returns:
        解析后的响应数据（字典格式）

    Raises:
        ValueError: 参数验证失败
        requests.exceptions.RequestException: 请求失败
    """
    # 1. 验证必填参数
    api_request.validate_param()

    # 2. 准备请求参数
    headers = {
        **api_request.headers,
        "Content-Type": api_request.content_type.value
    }

    # 3. 根据Content-Type处理请求体
    request_kwargs = {
        "method": api_request.method.value,
        "url": api_request.url,
        "headers": headers,
        "timeout": 5
    }

    if api_request.method == HttpMethod.GET:
        request_kwargs["params"] = api_request.request_data
    else:
        if api_request.content_type == ContentType.JSON:
            request_kwargs["json"] = api_request.request_data
        elif api_request.content_type == ContentType.FORM_URLENCODED:
            request_kwargs["data"] = api_request.request_data
        elif api_request.content_type == ContentType.FORM_DATA:
            request_kwargs["files"] = _prepare_files(api_request.request_data)

    # 4. 发送请求
    print("请求接口:"+api_request.url)
    response = requests.request(**request_kwargs)
    response.raise_for_status()
    print("接口请求完毕:"+api_request.url)

    # 5. 处理响应
    return _process_response(response, api_request)


def _prepare_files(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """处理multipart/form-data的文件上传"""
    files = {}
    for key, value in request_data.items():
        if hasattr(value, 'read'):  # 文件对象
            files[key] = value
        else:
            files[key] = (None, str(value))
    return files


def _process_response(response, api_request: ApiRequest) -> Dict[str, Any]:
    """根据ApiRequest定义处理响应"""
    # 自动根据Content-Type解析
    if 'application/json' in response.headers.get('Content-Type', ''):
        data = response.json()
    else:
        data = {"raw_response": response.text}

    # # 验证响应字段（可选）
    # if api_request.response_fields:
    #     _validate_response(data, api_request.response_fields)

    return data


def _validate_response(data: Dict[str, Any], expected_fields: List[FieldDefinition]):
    """验证响应是否包含预期的字段"""
    missing_fields = [
        field.name for field in expected_fields
        if field.required and field.name not in data
    ]
    if missing_fields:
        raise ValueError(f"响应缺少必填字段: {', '.join(missing_fields)}")

class ToolJson(BaseModel):
    tool_json: str = Field(description='工具测试json')

class ToolCheckResult(BaseModel):
    check: bool = Field(description='是否通过')

class McpAttribute(BaseModel):
    env: Optional[dict[str, str]] = Field(None, description='环境变量')
    command: Optional[str] = Field(None, description='命令')
    args: Optional[list[str]] = Field(None, description='参数')

class ToolInfo(BaseModel):
    url: str = Field(description="服务端地址")
    tool_name: str = Field(description="要调用的工具名称")
    argument: str = Field(description="按要求填写的工具入参")

class ToolInvokeRequest(BaseModel):
    tool_id: str = Field(description="调用工具id")
    arguments: dict = Field(description="调用工具入参")
