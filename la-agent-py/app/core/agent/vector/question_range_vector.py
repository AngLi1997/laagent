# -*- coding: utf-8 -*-
# @Time    : 2025/4/23 20:29
# @Author  : liang
# @FileName: question_range_vector.py.py
# @Software: PyCharm
from langchain_core.documents import Document
from langchain_postgres import PGVector
from loguru import logger
from pydantic import BaseModel, Field

from app.core.agent.llm.llm import BmosEmbeddings
from app.core.agent.vector import BGE_M3
from app.database.database_settings import dynamic_str_field
from config import Config


class BmosQuestionRankTask(BaseModel):
    question_range_id: str | int = dynamic_str_field(description='问题靶场id')
    content: str | int = dynamic_str_field(description='问题内容')


class BmosQuestionRankRetrieval(BmosQuestionRankTask):
    """向量数据库召回问题"""
    score: float | None = Field(None, description='相似度')
    answer: str | int | None = dynamic_str_field(description='预设回答')


class BmosQuestionRageVectorStore:
    """向量数据库 嵌入默认使用BGE_M3"""
    __embeddings: BmosEmbeddings
    __vector_store: PGVector

    def __init__(self, collection_name, embedding_model=BGE_M3):
        self.__embeddings = BmosEmbeddings(embedding_model)
        self.__vector_store = PGVector(embeddings=self.__embeddings, collection_name=collection_name,
                                       connection=Config.SQLALCHEMY_DATABASE_URI, use_jsonb=True, logger=logger)

    def embedding_question(self, question_rank: BmosQuestionRankTask):
        self.__vector_store.delete([question_rank.question_range_id])
        """嵌入问题"""
        docs = [Document(id=question_rank.question_range_id,
                         page_content=question_rank.content,
                         metadata={
                             'question_range_id': question_rank.question_range_id,
                             'embeddings': self.__embeddings.model
                         })]
        self.__vector_store.add_documents(docs)
        logger.info(f'问题嵌入向量数据库完成 question_range_id={question_rank.question_range_id}')
        pass

    def retrieval_question(self, text: str, top_k: int = 10, score_threshold: float = 0.8) -> list[BmosQuestionRankRetrieval]:
        """
        问题召回
        :param text: 问题
        :param top_k: 前k个
        :param score_threshold: 相似度阈值 只会返回相似度比这个阈值大的问题
        :return: 预设回答
        """

        if not text:
            return []

        from app.entities.question_range import BaQuestionRange
        from app.app_init import app
        with app.app_context():
            qrs = BaQuestionRange.query.all()
            if not qrs:
                return []
            qrs_dict = {qr.id: BmosQuestionRankRetrieval(question_range_id=qr.id, content=qr.question, answer=qr.answer, score=None) for qr in qrs}
            def __call_back_filter(qrs_ids: list[str] | None):
                """根据meta过滤"""
                # 默认有个嵌入模型的过滤
                condition = {'embeddings': self.__embeddings.model}
                # 文档id过滤
                if qrs_ids:
                    condition['question_range_id'] = {"$in": qrs_dict.keys()}
                return condition

            result: list[tuple[Document, float]] = self.__vector_store.similarity_search_with_relevance_scores(
                text,
                k=top_k,
                score_threshold=score_threshold,
                filter=__call_back_filter([qr.id for qr in qrs if qr.id in qrs_dict])
            )
            for chunk, score in result:
                qrs_dict[chunk.id].score = score
            return [qrs_dict[chunk.id] for chunk, score in result]

    def delete_question(self, question_range_ids: list[str]):
        """
        删除问题向量
        :param question_range_ids: 问题向量id
        :return:
        """
        self.__vector_store.delete(question_range_ids)
        logger.info(f'问题向量删除完成 question_range_ids={question_range_ids}')
