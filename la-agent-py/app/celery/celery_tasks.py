# -*- coding: utf-8 -*-
# @Time    : 2025/4/8 15:38
# @Author  : liang
# @FileName: celery_tasks.py
# @Software: PyCharm
"""
    消息队列任务
    这里主要放一些比较耗时的异步处理任务
"""
from loguru import logger

from app.app_init import app
from app.celery import celery
from app.core.agent.vector.document_vector import BmosChunkTask
from app.entities.document import BaDocumentChunk
from app.utils.key_word_util import extract_keywords


@celery.task
def extract_keywords_task(task: BmosChunkTask):
    """
    提取文档关键词后更新到数据库
    :param task: 文本分段任务
    :return: None
    """
    if not task.chunk_id or not task.content:
        return
    kws = extract_keywords(task.content)
    logger.info(f'''
        提取文档摘要: 
        chunk_id: {task.chunk_id},
        text: {task.content[:100]}..., 
        keywords: {kws}
    ''')
    try:
        with app.db.auto_commit_db():
            BaDocumentChunk.query.filter_by(id=task.chunk_id).update({'keywords': kws})
    except Exception as e:
        logger.error(f'更新失败: {e}')

@celery.task
def to_vector_task(task: BmosChunkTask):
    """
    向量化到pgvector
    :param task: 文本分段任务
    :return: None
    """
    logger.info(f'开始向量化')
    app.document_vector_store.to_vector(task)
    logger.info(f'向量化结束 chunk_id={task.chunk_id}')