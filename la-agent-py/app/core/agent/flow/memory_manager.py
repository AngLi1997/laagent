# -*- coding: utf-8 -*-
# @Time    : 2025/4/29 16:50
# @Author  : liang
# @FileName: memory_manager.py
# @Software: PyCharm
"""智能体记忆管理器"""
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg import Connection

from config import Config


class MemoryManager:

    """记忆管理器"""

    def __init__(self):
        self.__checkpointer = PostgresSaver(conn=Connection.connect(conninfo=Config.SQLALCHEMY_DATABASE_URI, autocommit=True, prepare_threshold=None))
        self.__checkpointer.setup()

    def clear_memory(self, conversation_id: str | int):
        """清除记忆"""
        if not conversation_id:
            return
        self.__checkpointer.delete_thread(conversation_id)


    def get_check_point(self) -> BaseCheckpointSaver[str]:
        """获取检查点"""
        return self.__checkpointer

memory_manager = MemoryManager()