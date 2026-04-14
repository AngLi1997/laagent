# -*- coding: utf-8 -*-
# @Time    : 2025/4/3 14:18
# @Author  : liang
# @FileName: naocs.py.py
# @Software: PyCharm
from tempfile import NamedTemporaryFile

from langchain_text_splitters import RecursiveCharacterTextSplitter
from loguru import logger
from sqlalchemy import or_, text as text_sql

from app.app_init import app
from app.blueprints.document_blueprint import validate_documents
from app.constants.enums.knowledge_enum import MatchingType
from app.entities.document import BaDocumentChunk, BaDocument
from app.entities.knowledge_base import BaKnowledgeBase, get_documents_by_kb_ids
from app.entities.knowledge_base_document_relationship import BaKnowledgeBaseDocumentRelationship
from app.exception.exception_handler import BmosException
from app.models.document import DocumentChunkInfo, DocumentChunk, DocumentRetrievalChunk
from app.utils.file_util import convert_file_storage_to_document
from app.utils.str_util import clear_url_and_email, trip_str


def langchain_split_document(tmp: NamedTemporaryFile, file_type: str, chunk_size: int, chunk_overlap: int,
                             separators: list[str], trip: bool = False, clear_url: bool = False) -> DocumentChunkInfo:
    """将临时文件使用langchain拆解为文档片段"""
    docs = convert_file_storage_to_document(tmp, file_type)
    spliter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap, separators=separators)
    docs = spliter.split_documents(docs)
    results = []
    index = 1
    for chunk in docs:
        if chunk.page_content:
            s = chunk.page_content
            if trip:
                logger.info(f'去除连续空格')
                s = trip_str(chunk.page_content)
            if clear_url:
                logger.info(f'去除邮件和url')
                s = clear_url_and_email(s)
            if s:
                results.append(DocumentChunk(chunk_index=index, content=s, length=len(s), id=None, keywords=None, retrieval_count=None))
                index += 1
    return DocumentChunkInfo(chunk_size=len(results), chunk_list=results)


def retrieval_chunks(knowledge_base_ids: list[str], document_ids: list[str], text: str,
                     matching_type: MatchingType = MatchingType.VECTOR, top_k: int = 3,
                     score_threshold: float = 0.3, rerank: bool = False) -> list[DocumentRetrievalChunk]:
    """
    召回测试
    :param knowledge_base_ids: 知识库id列表
    :param document_ids: 文档id列表
    :param text: 召回文本
    :param matching_type: 匹配方式
    :param top_k: 最匹配的前k个
    :param score_threshold: 相似度阈值
    :param rerank: 是否重新排序
    :return:
    """
    _ = validate_documents(document_ids)
    logger.info(f'''
        召回测试: {text}
        召回方式: {matching_type}
        top_k: {top_k}
        阈值: {score_threshold}
        rerank: {rerank}
    ''')
    if matching_type == MatchingType.VECTOR:
        # 向量匹配
        score_dict = {c.chunk_id: c.score for c in
                      app.document_vector_store.retrieval(text, top_k, score_threshold, document_ids)}
        chunks = (BaDocumentChunk.query.add_entity(BaDocument)
                  .join(BaDocument, BaDocument.id == BaDocumentChunk.document_id, isouter=True)
                  .filter(BaDocumentChunk.id.in_(score_dict.keys())).all())
        result = [
            DocumentRetrievalChunk(chunk_id=chunk.id, chunk_name=f'chunk_{chunk.chunk_index}',
                                   chunk_index=chunk.chunk_index, content=chunk.content,
                                   length=chunk.length, keywords=chunk.keywords, score=score_dict.get(chunk.id, 0),
                                   document_id=document.id, document_name=document.name,
                                   document_source_url=document.source_url,
                                   knowledge_base_name=get_knowledge_base_name_in_scope(document, knowledge_base_ids))
            for chunk, document in chunks]
    elif matching_type == MatchingType.FUZZY:
        # 模糊匹配
        chunks = (BaDocumentChunk.query
                  .add_entity(BaDocument)
                  .join(BaDocument, BaDocument.id == BaDocumentChunk.document_id, isouter=True)
                  .filter(BaDocumentChunk.document_id.in_(document_ids))
                  .filter(
            or_(BaDocumentChunk.content.ilike(f'%{text}%'), BaDocumentChunk.keywords.contains([f'{text}'])))
                  .limit(top_k)
                  .all())
        result = [
            DocumentRetrievalChunk(chunk_id=chunk.id, chunk_name=f'chunk_{chunk.chunk_index}',
                                   chunk_index=chunk.chunk_index, content=chunk.content,
                                   length=chunk.length, keywords=chunk.keywords, score=None,
                                   document_id=document.id, document_name=document.name,
                                   document_source_url=document.source_url,
                                   knowledge_base_name=get_knowledge_base_name_in_scope(document, knowledge_base_ids))
            for chunk, document in chunks]
    else:
        raise BmosException('未知的匹配方式')
    logger.info(f'共召回{len(result)}个文档分片')

    if len(result) != 0:
        # 每个分片召回次数+1
        update_sql = "update ba_document_chunk set retrieval_count = retrieval_count + 1 where id in :ids"
        app.db.session.execute(text_sql(update_sql).bindparams(ids=tuple([e.chunk_id for e in result])))
        app.db.session.commit()

    for e in result:
        e.score = round(e.score, 3) if e.score else 0
    result.sort(key=lambda x: x.score, reverse=True)
    return result


def retrieval_chunks_with_kb_ids(knowledge_base_ids: list[str],
                                 text: str,
                                 matching_type: MatchingType = MatchingType.VECTOR, top_k: int = 3,
                                 score_threshold: float = 0.3, rerank: bool = False) -> list[DocumentRetrievalChunk]:
    """
    根据知识库id列表召回文本段
    :param knowledge_base_ids: 知识库id list
    :param text: 召回文本
    :param matching_type: 匹配方式
    :param top_k: 最匹配的前k个
    :param score_threshold: 相似度阈值
    :param rerank: 是否重新排序
    :return:
    """
    if not knowledge_base_ids:
        return []
    documents = get_documents_by_kb_ids(knowledge_base_ids)
    if not documents:
        return []
    return retrieval_chunks(knowledge_base_ids, [d.id for d in documents], text, matching_type, top_k,
                            score_threshold, rerank)


def get_knowledge_base_name_in_scope(document: BaDocument, scope: list[str]) -> str:
    """获取文档关联的第一个知识库名称"""

    kbs = [kb for kb, r in (BaKnowledgeBase.query
                            .add_entity(BaKnowledgeBaseDocumentRelationship)
                            .join(BaKnowledgeBaseDocumentRelationship,
                                  BaKnowledgeBaseDocumentRelationship.knowledge_base_id == BaKnowledgeBase.id,
                                  isouter=True)
                            .filter(BaKnowledgeBaseDocumentRelationship.document_id == document.id)).all()]
    if kbs:
        for kb in kbs:
            if scope and kb.id in scope:
                return kb.name
    return ''