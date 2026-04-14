# -*- coding: utf-8 -*-
# @Time    : 2025/4/7 10:24
# @Author  : liang
# @FileName: key_word_util.py
# @Software: PyCharm

"""关键词提取器"""
from typing import Union

import jieba.analyse
from langchain_openai import ChatOpenAI
from loguru import logger
from pydantic import SecretStr

from app.utils.str_util import extract_list_from_str

llm = ChatOpenAI(model="deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B", base_url="https://api.siliconflow.cn/v1", api_key=SecretStr("sk-rcjroagmtltmudleqcpxrenfsqxbjeumpfhbbquveffgfrtr"), temperature=0)

def extract_keywords(text: str, top_k: int = 10, extract_mode: Union['jieba', 'llm'] = 'jieba') -> list[str]:
    """
    提取关键词
    :param text: 文本内容
    :param top_k: 提取关键词数量
    :param extract_mode 提取模式
    :return:
    """
    if extract_mode == 'llm':
        logger.info(f'使用{llm.model_name}提取关键词')
        result = llm.invoke(f'''
            文本内容：
            {text}
            1、请输出上述内容的关键词,数量不超过{top_k}个
            2、关键词内容必须与以上输入有关，如果文本过短，可以减少关键词提取数量
            3、提取出来的不能是句子，只提取词语
            4、严格遵守！不要编造关键词
            5、严格遵守！输出的格式为：
            ["key1", "key2"...]
        ''')
        try:
            info = result.text().strip().split('</think>')[1]
            return extract_list_from_str(info)[:top_k]
        except Exception as e:
            logger.error(f'提取关键词异常: {e}')
            return []
    elif extract_mode == 'jieba':
        logger.info('使用jieba提取关键词')
        result = jieba.analyse.textrank(text, topK=top_k, withWeight=True)
        return [x for x, w in result]
    else:
        raise ValueError('extract_mode must be jieba or llm')