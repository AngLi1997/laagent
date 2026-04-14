from datetime import datetime

from pydantic import BaseModel, Field

from app.database.database_settings import dynamic_str_field
from app.models.common.page import PageRequest


class QuestionRequest(BaseModel):
    id: str = Field('id',description="id")
    question: str = Field('问题',description="问题")
    answer: str = Field('回答',description="回答")

class QuestionQueryRequest(PageRequest):
    question: str = None
    answer: str = None

class QuestionQueryResponse(BaseModel):
    id: str = Field('id',description="id")
    question: str = Field('问题',description="问题")
    answer: str = Field('回答',description="回答")
    mark_time: datetime = Field('标记时间',description="标记时间（创建时间）")
    hit_number: int = Field('命中次数',description="命中次数")

class QuestionRangeRetrievalQuery(BaseModel):
    content: str | int = dynamic_str_field(description='问题内容')