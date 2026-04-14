from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database_settings import Base, db


class BaQuestionRange(db.Model, Base):
    __tablename__ = 'ba_question_range'
    __table_args__ = {'extend_existing': True}
    question: Mapped[str] = mapped_column(String,comment="提问")
    answer: Mapped[str] = mapped_column(String,comment="回答")
    hit_number: Mapped[int] = mapped_column(Integer,comment="命中次数")


    def __init__(self, question, answer, hit_number):
        super().__init__()
        self.question = question
        self.answer = answer
        self.hit_number = hit_number

    def __repr__(self):
        return f"<BaQuestionRange(question={self.question}, answer={self.answer}, hit_number={self.hit_number})>"
