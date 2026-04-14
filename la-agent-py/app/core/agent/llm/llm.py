# -*- coding: utf-8 -*-
# @Time    : 2025/3/28 17:13
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm

"""大模型"""
from flask_sqlalchemy.session import Session
from langchain_core.language_models import BaseChatModel
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_openai import ChatOpenAI

from app.constants.enums.llm_enum import KeyTypeEnum
from app.exception.exception_handler import BmosException
from config import Config


class BmosEmbeddings(OllamaEmbeddings):
    def __init__(self, model=None, base_url=Config.OLLAMA_BASE_URL):
        super().__init__(
            base_url=base_url,
            model=model)


class BmosChatLLM(ChatOllama):
    def __init__(self, model=None, base_url=Config.OLLAMA_BASE_URL, temperature=0.8):
        super().__init__(
            model=model,
            base_url=base_url,
            temperature=temperature
        )

def get_llm_by_id(llm_id: str) -> BaseChatModel:
    """根据id查询大模型信息"""

    from app.app_init import app
    from app.entities.llm import BaLLM

    with app.app_context():
        with Session(app.db):
            llm = BaLLM.query.get(llm_id)
            if llm.key_type == KeyTypeEnum.OPENAI:
                return ChatOpenAI(model=llm.name, base_url=llm.url, api_key=llm.api_key)
            elif llm.key_type == KeyTypeEnum.OLLAMA:
                return ChatOllama(model=llm.name, base_url=llm.url)
            else:
                raise BmosException('模型类型不支持')