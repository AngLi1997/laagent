
from typing import Dict, Any, List

import requests

from app.constants.enums.tool_enum import HttpMethod, ContentType
from app.models.tool import FieldDefinition, ApiRequest


def execute(api_request: ApiRequest) -> Dict[str, Any]:
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

    # response.raise_for_status()
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

    # # 验证响应字段
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