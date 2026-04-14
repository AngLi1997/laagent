from difflib import SequenceMatcher
from typing import List

import numpy as np
from langchain_ollama import OllamaEmbeddings
from loguru import logger
from mpmath import norm

from app.entities.question_range import BaQuestionRange


def combined_similarity(
    input: str,
    db_qa: BaQuestionRange,
    embedding: OllamaEmbeddings,
    vector_weight: float = 0.7,
    text_weight: float = 0.3
) -> float:
    """综合向量相似度和文本相似度"""
    vec_sim = cosine_similarity(
        np.array(embedding.embed_query(input)),
        np.array(db_qa.qa_vector)
    )
    seq_sim = SequenceMatcher(None, input, db_qa.question).ratio()
    return vec_sim * vector_weight + seq_sim * text_weight

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """计算余弦相似度"""
    return np.dot(a, b) / (norm(a) * norm(b))


def get_answer(user_input: str, embedding: OllamaEmbeddings,qa_database: List[BaQuestionRange], threshold: float = 0.75) -> str | None:
    # 计算与所有预存问题的相似度
    best_match = None
    max_similarity = -1
    for qa_item in qa_database:
        similarity = combined_similarity(input=user_input, db_qa=qa_item,embedding=embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            best_match = qa_item

    logger.info(f"当前输入与靶场匹配{max_similarity},设定阈值{threshold}")
    # 判断阈值
    if best_match and max_similarity >= threshold:
        # 命中问答之后，命中次数+1
        best_match.hit_number = best_match.hit_number + 1
        return str(best_match.answer)

    return None