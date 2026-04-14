# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 13:33
# @Author  : liang
# @FileName: swagger_to_prompt.py
# @Software: PyCharm
 
import requests
def swagger_to_prompt(url: str):
    """
    将swagger文档url转换为prompt
    :param url:
    :return: prompt
    """
    result = requests.get(url)
    if result.status_code == 200:
        swagger_json = result.json()
        apis = generate_swagger_prompts(swagger_json)
    pass


def generate_swagger_prompts(swagger_data):
    """将Swagger文档转换为自定义格式"""
    output = []
    schemas = swagger_data.get('components', {}).get('schemas', {})

    for path, methods in swagger_data['paths'].items():
        for method, config in methods.items():
            if method.lower() != 'get':
                continue  # 根据需求可扩展其他方法

            # 基础信息
            interface = [
                f"desc: {config.get('summary', '')}",
                f"url: {path}",
                f"method: {method.upper()}",
                "contentType: application/json"
            ]

            # 处理参数
            params = []
            for param in config.get('parameters', []):
                schema = param.get('schema', {})
                param_type = schema.get('type', 'unknown')
                param_desc = param.get('description', '')
                params.append(f"  - {param['name']}: {param_type} {param_desc}")

            interface.append("params:\n" + ("\n".join(params) if params else " []"))

            # 处理返回字段
            returns = []
            response_schema = config['responses']['200']['content']['application/json']['schema']
            if '$ref' in response_schema:
                schema_name = response_schema['$ref'].split('/')[-1]
                model = schemas.get(schema_name, {})
                for prop, prop_config in model.get('properties', {}).items():
                    prop_type = prop_config.get('type', 'unknown')
                    prop_desc = prop_config.get('description', '')
                    returns.append(f"  - {prop}: {prop_type} {prop_desc}")

            interface.append("return:\n" + ("\n".join(returns) if returns else " []"))
            interface.insert(0, "--------------")
            interface.append("--------------")
            output.append("\n".join(interface))
    return "\n".join(output)