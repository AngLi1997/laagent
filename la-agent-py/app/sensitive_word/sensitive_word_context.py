# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 16:13
# @Author  : liang
# @FileName: sensitive_word_context.py
# @Software: PyCharm
from ahocorasick import Automaton
from loguru import logger

from app.constants.enums.review_enums import HandleMethodEnum

# 敏感词
__sensitive_automaton = Automaton()
__sensitive_handle_dict = {}
__replace_symbol = '🚫'


def load_sensitive_words():
    """加载敏感词"""
    logger.info(f'正在加载敏感词...')
    __sensitive_words = {}
    from app.app_init import app
    with app.app_context():
        app.db.session.flush()
        global __sensitive_automaton
        global __sensitive_handle_dict
        __sensitive_automaton.clear()
        __sensitive_handle_dict = {}
        from app.entities.review import BaSensitive
        # 排序 默认 FUZZY_COVER在前 STRAIGHT_ANSWER在后，这样后面的STRAIGHT_ANSWER优先级更高
        sensitives = BaSensitive.query.order_by(BaSensitive.handle_method).filter(BaSensitive.enable == True).all()
        if not sensitives:
            logger.info(f'未找到启用的敏感词')
            return
        for sensitive in sensitives:
            __sensitive_handle_dict[sensitive.id] = (
                sensitive.word_group, sensitive.handle_method, sensitive.canned_answer)
            words = sensitive.keyword_group.split(',')
            for word in words:
                __sensitive_words[word] = (sensitive.id, word)
        for w in __sensitive_words:
            __sensitive_automaton.add_word(w, __sensitive_words[w])
        __sensitive_automaton.make_automaton()
        logger.info(f'加载敏感词成功:共加载{len(__sensitive_words)}个敏感词')


def check_sensitive_word(text: str) -> list[tuple[int, str, str, HandleMethodEnum]]:
    """
    匹配敏感词
    :param text: 匹配文本
    :return: [匹配index、内容审查id、匹配词、处理方式]
    """
    res = []
    match_result = __sensitive_automaton.iter(text)
    for end_index, (id_, word) in match_result:
        word_group, handle_method, canned_answer = __sensitive_handle_dict.get(id_)
        res.append((end_index, id_, word, handle_method))
    if len(res) != 0:
        logger.info(f'共匹配到{len(res)}个敏感词')
    return res


def handle_sensitive_word(text: str, keyword: str,
                          sensitive_id: str,
                          conversation_id: str | int,
                          question_id: str | int = None,
                          answer_id: str | int = None,
                          text_cache: list[str] = None) -> str:
    if sensitive_id not in __sensitive_handle_dict:
        logger.info(f'未找到敏感词拦截器,直接返回')
        return text
    """
    处理敏感词
    :param text: 匹配文本
    :param keyword: 敏感词
    :param sensitive_id: 内容审查id
    :param conversation_id: 对话id
    :param question_id: 问题id
    :param answer_id: 答案id
    :return: 替换敏感词后的文本
    """
    keyword_group, handle_method, canned_answer = __sensitive_handle_dict.get(sensitive_id)

    from app.entities.review import BaSensitiveHistory
    history = BaSensitiveHistory(sensitive_id=sensitive_id, input_=text, keyword_group=keyword_group,
                                handle_method=handle_method, keyword=keyword, question_id=question_id,
                                answer_id=answer_id,
                                conversation_id=conversation_id)
    if handle_method == HandleMethodEnum.FUZZY_COVER:
        # 模糊匹配
        l = len(keyword)
        rep = __replace_symbol * l
        logger.info(f'匹配敏感词组[{keyword_group}]命中, [{keyword}]替换为{rep}')
        res = text.replace(keyword, rep)
        # 匹配断开的敏感词（一部分在上一个message中，所以这里只处理剩下的部分)
        if text_cache:
            res = filter_sensitive_words(text_cache, keyword, __replace_symbol)

    else:
        # 短路回答
        logger.info(f'匹配敏感词组[{keyword_group}]命中, 拦截消息：{canned_answer}')
        res = canned_answer
    from app.app_init import app
    # 记录拦截记录
    with app.app_context():
        history.output = res
        app.db.session.add(history)
        app.db.session.commit()
    return res

def get_has_straight_answer(warn: list[tuple[int, str, str, HandleMethodEnum]]) -> str | None:
    for end_index, id_, word, handle_method in warn:
        if handle_method == HandleMethodEnum.STRAIGHT_ANSWER:
            _, _, canned_answer = __sensitive_handle_dict.get(id_)
            return canned_answer


def filter_sensitive_words(text_list, sensitive_word, sym: str):
    if not text_list:
        return None

    result = []
    accumulated_text = ''
    for current in text_list:
        # 累积拼接
        accumulated_text += current

        # 检查是否命中敏感词
        if sensitive_word in accumulated_text:
            # 找出敏感词在累积文本中的起始位置
            start_index = accumulated_text.find(sensitive_word)
            if start_index != -1:
                # 敏感词覆盖范围：start_index 到 start_index + len(sensitive_word)
                sensitive_range = set(range(start_index, start_index + len(sensitive_word)))
                # 构造当前项的替换结果
                modified_current = ''
                current_start = len(accumulated_text) - len(current)
                for i in range(len(current)):
                    char_pos = current_start + i
                    if char_pos in sensitive_range:
                        modified_current += sym
                    else:
                        modified_current += current[i]
                result.append(modified_current)
            else:
                result.append(current)
        else:
            result.append(current)
    return result[-1] if result else None