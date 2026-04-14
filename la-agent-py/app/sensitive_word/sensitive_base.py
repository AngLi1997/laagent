# -*- coding: utf-8 -*-
# @Time    : 2025/5/13 10:09
# @Author  : liang
# @FileName: sensitive_base.py
# @Software: PyCharm
"""敏感词基本词库"""
import os

from ahocorasick import Automaton
from loguru import logger

from app.constants.enums.review_enums import HandleMethodEnum
from app.entities.review import BaSensitiveHistory
from app.exception.exception_handler import TerminalException


def load_sensitive_base():
    """
    加载所有敏感词库文件
    :return: 包含所有敏感词的字典，按文件名分类
    """

    __automaton = Automaton()

    # 获取当前文件所在目录的绝对路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # 构建base_data目录的绝对路径
    base_data_dir = os.path.join(current_dir, 'base_data')
    
    # 存储所有敏感词的字典，以文件名为键
    sensitive_words = {}
    
    # 检查base_data目录是否存在
    if not os.path.exists(base_data_dir):
        logger.error(f"警告：目录 {base_data_dir} 不存在")
        return sensitive_words
    
    # 遍历base_data目录下的所有文件
    for filename in os.listdir(base_data_dir):
        if filename.endswith('.txt'):
            file_path = os.path.join(base_data_dir, filename)
            # 提取文件名（不含扩展名）作为分类名
            category = os.path.splitext(filename)[0]
            sensitive_words[category] = set()
            try:
                # 使用UTF-8编码读取文件内容
                with open(file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        # 去除行尾的空白字符并添加到相应分类中
                        word = line.strip()
                        if word:  # 忽略空行
                            sensitive_words[category].add(word)
                logger.info(f"已加载【{category}】词库，共{len(sensitive_words[category])}个敏感词")
            except Exception as e:
                logger.info(f"读取文件 {filename} 时出错: {str(e)}")
    
    # 统计总词数
    total_words = sum(len(words) for words in sensitive_words.values())
    logger.info(f"敏感词库加载完成，共 {len(sensitive_words)} 个分类，{total_words} 个敏感词")
    i = 0
    for c, v in sensitive_words.items():
        for w in v:
            i += 1
            __automaton.add_word(w,  (c, w))
    __automaton.make_automaton()
    return __automaton

__base = load_sensitive_base()

def check_base_sensitive_word(text: str, question_id: str, answer_id: str, conversation_id: str):
    match_res = __base.iter(text)
    from app.app_init import app
    for end_index, (category, word) in match_res:
        with app.app_context():
            with app.db.auto_commit_db():
                history = BaSensitiveHistory(sensitive_id=0, input_=text, keyword_group=f'{category}[system]',
                                             handle_method=HandleMethodEnum.STRAIGHT_ANSWER, keyword=word,
                                             question_id=question_id,
                                             answer_id=answer_id,
                                             conversation_id=conversation_id)
                app.db.session.add(history)
                app.db.session.flush()
        raise TerminalException(f'触发系统敏感词：【{category}】')