import json
from typing import Dict, Any, Union

import requests
from langchain.tools import BaseTool
from pydantic import create_model, Field


def create_dynamic_tool(tool_name: str, description: str, json_config: Dict[str, Any]) -> BaseTool:
    """动态创建 REST API 工具

    Args:
        tool_name: 工具名称
        description: 工具描述
        json_config: 包含接口配置的JSON字典

    Returns:
        配置好的BaseTool实例
    """
    # 1. 动态创建参数模型
    fields = {}
    param_descriptions = []

    for param in json_config.get('params', []):
        # 为每个参数创建Field
        param_name = param['name']
        param_type = _map_param_type(param['paramType'])
        field_kwargs = {
            'description': param['description'],
            'example': param.get('example'),
            # 使用Field添加额外元数据
            'field_info': Field(
                ... if param['required'] else None,
                description=param['description'],
            )
        }
        fields[param_name] = (param_type, field_kwargs['field_info'])

        # 收集参数描述信息
        required_flag = "必填" if param['required'] else "可选"
        param_descriptions.append(
            f"{param_name}: {param['description']} "
            f"(类型: {param['paramType']}, 示例: {param.get('example', '无')}, {required_flag})"
        )

    # 动态创建Pydantic模型
    args_model = create_model(
        f"{tool_name.capitalize()}Input",
        **fields
    )

    # 2. 构建完整工具描述
    full_description = (
            f"{description}\n\n"
            f"接口地址: {json_config['url']}\n"
            f"请求方法: {json_config['method']}\n\n"
            f"参数说明:\n" + "\n".join(f"  - {desc}" for desc in param_descriptions) + "\n\n"
            f"请求示例: {json.dumps(json_config.get('request_data', {}), ensure_ascii=False, indent=2)}\n\n"
            f"响应示例: {json_config.get('response_fields', '无')}"
    )

    # 3. 创建工具类
    class DynamicRestTool(BaseTool):
        name: str = tool_name
        description: str = full_description
        # args_schema: Type[BaseModel] = args_model

        def _run(self, action_input: Union[str, dict],**kwargs: Any) -> str:
            # 统一输入格式处理
            if isinstance(action_input, str):
                try:
                    params = json.loads(action_input.strip())
                except json.JSONDecodeError:
                    raise ValueError(f"无效的JSON输入: {action_input}")
            else:
                params = action_input

            try:
                # 合并默认请求数据和用户输入
                request_data = params
                request_data.update(kwargs)

                # 发送请求
                response = requests.request(
                    method=json_config['method'],
                    url=json_config['url'],
                    headers=json_config['headers'],
                    params=kwargs,  # 查询参数放在URL
                    json=request_data,  # 请求体数据
                    timeout=5
                )
                response.raise_for_status()

                # 格式化响应
                return json.dumps(response.json()["data"], ensure_ascii=False, indent=2)

            except Exception as e:
                return f"API调用失败: {str(e)}"

    return DynamicRestTool()


def _map_param_type(param_type: str) -> type:
    """映射参数类型到Python类型"""
    type_mapping = {
        'int': int,
        'string': str,
        'bool': bool,
        'float': float,
        'number': float
    }
    return type_mapping.get(param_type.lower(), str)


# 使用示例
if __name__ == "__main__":
    # 你的JSON配置
    tool_config = {
        "content_type": "application/json",
        "headers": {"bmos-access-token": "eyJhbGciOiJIUzM4NCJ9.eyJ1c2VyX2lkIjoiMTgxNTU5MDYzMjE5MTkxODA4MCIsImxvZ2luX3Rva2VuIjoiYTgwODI0NTktOGYzYi00YWU0LThmODYtODQ1MjU4OTkyMzgyIn0.x6UeFpojN5YfA7vIsx1bvDtTT0R2KiYxouHVqEJ4KHDRrKoNiIJqpFXGLF-s7JAr"},
        "method": "POST",
        "params": [
            {
                "description": "当前页",
                "example": 1,
                "name": "pageNum",
                "paramType": "int",
                "required": True
            },
            {
                "description": "当前页条数",
                "example": 10,
                "name": "pageSize",
                "paramType": "int",
                "required": True
            }
        ],
        "request_data": {"pageNum": 1, "pageSize": 20},
        "response_fields": "{\"code\": \"响应码(0代表接口请求成功,非0代表请求异常)\", \"message\": \"接口响应消息\", \"data\": {\"pageNum\": \"当前页码\", \"pageSize\": \"当前页条数\", \"totalPage\": \"总页数\", \"total\": \"总记录数\", \"list\": [{\"originOrgCode\": \"样本来源单位编码\", \"originOrgInfo\": {\"originOrgCode\": \"样本来源单位编码\", \"originOrg\": \"样本来源单位名称\"}, \"syncBatchNo\": \"样本的批次号\", \"warehouse\": {\"value\": 1, \"label\": \"仓库\", \"name\": \"仓库\"}, \"totalNum\": \"批次样本总数\", \"boxIdUp\": \"样本箱号起\", \"boxIdDown\": \"样本箱号止\", \"coldChainBizNum\": \"运输车牌号\", \"beginTime\": \"起运时间\", \"endTime\": \"运抵时间\", \"temperature\": \"运输温度\", \"transitTime\": \"运输时长\", \"alarmNum\": 0, \"acceptanceStatus\": {\"value\": 1, \"label\": \"验收正常\", \"name\": \"验收正常\"}, \"acceptanceBy\": \"验收人名称\", \"acceptanceDate\": \"验收时长\", \"waitAuditStatus\": null, \"auditResult\": null, \"auditBy\": null, \"auditDate\": null}]}}",
        "url": "http://172.30.1.163/api/bmos-plasma/sample-wait-in-storage/page-list"
    }

    # 创建工具实例
    dynamic_tool = create_dynamic_tool(
        tool_name="sample_query",
        description="查询样本数据",
        json_config=tool_config
    )

    # 打印工具信息
    print(f"工具名称: {dynamic_tool.name}")
    print(f"工具描述: {dynamic_tool.description}")
    print("\n参数模型结构:")
    print(dynamic_tool.args_schema.schema_json(indent=2))

    # 测试调用
    # print("\n测试调用结果:")
    # print(dynamic_tool.run(pageNum=2, pageSize=5))