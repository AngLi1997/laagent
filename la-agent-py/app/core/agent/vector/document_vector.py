# -*- coding: utf-8 -*-
# @Time    : 2025/3/28 09:48
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm

"""向量数据库"""
from langchain_core.documents import Document
from langchain_postgres import PGVector
from loguru import logger
from pydantic import BaseModel, Field

from app.core.agent.llm.llm import BmosEmbeddings
from app.core.agent.vector import BGE_M3
from config import Config


class BmosChunkTask(BaseModel):
    """向量数据库文档"""
    chunk_id: str = Field(description='分段id')
    content: str = Field(description='分段内容')
    document_id: str | None = Field(None, description='文档id')

class BmosChunkRetrieval(BmosChunkTask):
    """向量数据库召回文档"""
    score: float | None = Field(None, description='相似度')


class BmosDocumentVectorStore:
    """向量数据库 嵌入默认使用BGE_M3"""

    __embeddings: BmosEmbeddings
    __vector_store: PGVector

    def __init__(self, collection_name, embedding_model=BGE_M3):
        self.__embeddings = BmosEmbeddings(embedding_model)
        self.__vector_store = PGVector(embeddings=self.__embeddings, collection_name=collection_name,
                                       connection=Config.SQLALCHEMY_DATABASE_URI, use_jsonb=True, logger=logger)

    def to_vector(self, chunk: BmosChunkTask):
        """
        向量化
        :param chunk: 文档分片任务
        :return:
        """
        docs = [Document(id=chunk.chunk_id,
                         page_content=chunk.content,
                         metadata={
                             'chunk_id': chunk.chunk_id,
                             'document_id': chunk.document_id,
                             'embeddings': self.__embeddings.model
                         })]
        self.__vector_store.delete([str(chunk.chunk_id)])
        self.__vector_store.add_documents(docs)
        logger.info(f'文档分片嵌入向量数据库完成 chunk_id={chunk.chunk_id}')

    def delete_vector(self, chunk_ids: list[str]):
        """
        删除向量
        :param chunk_ids: 文档分片id
        :return:
        """
        self.__vector_store.delete(chunk_ids)
        logger.info(f'文档分片向量删除完成 chunk_ids={chunk_ids}')

    def retrieval(self, text: str, top_k:int = 10, score_threshold:float =0.5, document_ids:list[str] = None) -> list[BmosChunkRetrieval]:
        """
        文档召回
        :param text: 召回输入信息
        :param top_k: 前k个
        :param score_threshold: 相似度阈值 只会返回相似度比这个阈值大的分片
        :param document_ids: 文档ids列表 条件
        :return:
        """

        if not document_ids:
            return []

        def __call_back_filter(document_id_condition: list[str] | None):
            """根据meta过滤"""
            # 默认有个嵌入模型的过滤
            condition = {'embeddings': self.__embeddings.model}
            # 文档id过滤
            if document_id_condition:
                condition['document_id'] = {"$in": document_id_condition}
            return condition

        result: list[tuple[Document, float]] = self.__vector_store.similarity_search_with_relevance_scores(
            text,
            k=top_k,
            score_threshold=score_threshold,
            filter=__call_back_filter(document_ids)
        )
        return [BmosChunkRetrieval(document_id=chunk.metadata.get('document_id'),
                                   chunk_id=chunk.metadata.get('chunk_id'),
                                   content=chunk.page_content,
                                   score=score) for chunk, score in result]