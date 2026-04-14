# -*- coding: utf-8 -*-
# @Time    : 2025/4/16 15:26
# @Author  : liang
# @FileName: llm_util.py
# @Software: PyCharm

from loguru import logger

from app.core.agent.llm.llm import BmosChatLLM
from app.core.prompts import RECOMMENDED_QUESTIONS
from app.utils.str_util import extract_list_from_str

llm = BmosChatLLM("deepseek-r1:1.5b", temperature=0)

def generate_recommended_questions(query: str, answer_tokens: str, max_size: int) -> list[str]:
    result = llm.invoke([
        {
            "role": "system",
            "content": RECOMMENDED_QUESTIONS
        },
        {
            "role": "user",
            "content": f'''\n问题：{query}\n回答：{answer_tokens}\n请生成推荐问题'''
        }
    ])
    try:
        resp = result.text().strip()
        # logger.info(f'模型返回推荐问题: {resp}')
        info = resp.split('</think>')[1].strip()
        return extract_list_from_str(info)[:max_size]
    except Exception as e:
        logger.error(f'''提取推荐问题异常:
        问题：{query} 
        异常：{e}
    ''')
        return []