# -*- coding: utf-8 -*-
# @Time    : 2025/4/16 15:50
# @Author  : liang
# @FileName: str_util.py
# @Software: PyCharm
import ast
import json
import re


def extract_list_from_str(text: str) -> list[str]:
    """
    提取字符串中包含[]的内容 并去重
    :param text: 文本
    :return: 内容list
    """
    pattern = r'\[([^]]*)\]'
    matches = re.findall(pattern, text)
    results = []
    for array_str in matches:
        res = ast.literal_eval(f'[{array_str}]')
        if res:
            results.extend(res)
    return list(set(results))


def trip_str(s: str) -> str | None:
    """替换掉连续的空格、换行符和制表符"""
    if not s:
        return None
    return re.sub(r'\s+', ' ', s)

def clear_url_and_email(s: str) -> str | None:
    """去除URL和电子邮件地址"""
    if not s:
        return None
    return re.sub(r'http\S+|www\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '', s)


def extract_json(text: str) -> dict | None:
    # 提取 JSON 字符串
    json_match = re.search(r"```json\n(.*?)\n```", text, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
    else:
        # 尝试另一种常见的 Markdown 代码块格式
        json_match = re.search(r"```\n(.*?)\n```", text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = None

    # 将 JSON 字符串转换为字典
    if json_str:
        try:
            data_dict = json.loads(json_str)
            return data_dict
        except json.JSONDecodeError as e:
            print(f"JSON 解析错误: {e}")
            return None
    else:
        print("未找到 JSON 字符串")
        return None


def string_to_dict(input_string):
    if not input_string:
        return None
    try:
        # 尝试使用 json.loads 解析
        return json.loads(input_string)
    except json.JSONDecodeError:
        try:
            # 如果 json.loads 失败，尝试使用 ast.literal_eval 解析
            return ast.literal_eval(input_string)
        except (ValueError, SyntaxError) as e:
            # 如果两者都失败，可以引发异常或返回 None
            print(f"无法将字符串转换为字典: {e}")
            return None