from sqlalchemy import String, BigInteger
from sqlalchemy.orm import mapped_column, Mapped

from app.constants.enums.review_enums import HandleMethodEnum
from app.database.database_settings import Base, db


class BaSensitive(db.Model, Base):
    __tablename__ = 'ba_sensitive'
    __table_args__ = {'extend_existing': True, 'comment': '内容审核表'}

    word_group: Mapped[str] = mapped_column(String, comment='词组名称', nullable=False)
    handle_method: Mapped[HandleMethodEnum] = mapped_column(String, comment='处理方式')
    keyword_group: Mapped[str] = mapped_column(String, comment='关键词组', nullable=False)
    canned_answer: Mapped[str] = mapped_column(String, comment='预设答案', nullable=True)
    enable: Mapped[bool] = mapped_column(comment='是否启用', nullable=False)

    def __init__(self, word_group, handle_method, keyword_group, canned_answer, hit_count, enable, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.word_group = word_group
        self.handle_method = handle_method
        self.keyword_group = keyword_group
        self.canned_answer = canned_answer
        self.hit_count = hit_count
        self.enable = enable

    def __repr__(self):
        return (
            f"<BaSensitive(word_group={self.word_group}, handle_method={self.handle_method}, keyword_group={self.keyword_group}, "
            f"canned_answer={self.canned_answer}, hit_count={self.hit_count}, enable={self.enable})>")


# class BaReviewInterceptionRecord(app.db.Model, Base):
#     __tablename__ = 'ba_review_interception_record'
#     __table_args__ = {'extend_existing': True, 'comment': '内容审核拦截记录表'}
#
#     chat_review_id: Mapped[int] = mapped_column(BigInteger, comment='聊天审核id', nullable=False)
#     message: Mapped[str] = mapped_column(String, comment='消息信息', nullable=False)
#     hit_keyword: Mapped[str] = mapped_column(String, comment='命中敏感词', nullable=False)
#
#     def __init__(self, chat_review_id, message, hit_keyword, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.chat_review_id = chat_review_id
#         self.message = message
#         self.hit_keyword = hit_keyword
#
#     def __repr__(self):
#         return f"<BaChatReviewLog(chat_review_id={self.chat_review_id}, message={self.message}, hit_keyword={self.hit_keyword}"


class BaSensitiveHistory(db.Model, Base):

    """敏感词拦截记录"""
    sensitive_id: Mapped[int] = mapped_column(BigInteger, comment='敏感词组id')
    keyword_group: Mapped[str] = mapped_column(String, comment='词组名称')
    handle_method: Mapped[HandleMethodEnum] = mapped_column(String, comment='处理方式')
    keyword: Mapped[str] = mapped_column(String, comment='关键词')
    question_id: Mapped[int] = mapped_column(BigInteger, comment='问题id', nullable=True)
    answer_id: Mapped[int] = mapped_column(BigInteger, comment='对话id', nullable=True)
    conversation_id: Mapped[int] = mapped_column(BigInteger, comment='对话id')
    input: Mapped[str] = mapped_column(String, comment='输入内容', nullable=True)
    output: Mapped[str] = mapped_column(String, comment='输出内容', nullable=True)

    def __init__(self, sensitive_id, keyword_group, handle_method, keyword, question_id, answer_id, conversation_id,
                 input_, output=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.sensitive_id = sensitive_id
        self.keyword_group = keyword_group
        self.handle_method = handle_method
        self.keyword = keyword
        self.question_id = question_id
        self.answer_id = answer_id
        self.conversation_id = conversation_id
        self.input = input_
        self.output = output
