from flask_openapi3 import Tag, APIBlueprint

from app.app_init import app
from app.core.agent.vector.question_range_vector import BmosQuestionRankTask, BmosQuestionRankRetrieval
from app.entities.question_range import BaQuestionRange
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.question_range import QuestionRequest, QuestionQueryResponse, QuestionQueryRequest, \
    QuestionRangeRetrievalQuery

questions_tag = Tag(name='问题靶场接口')
questions_bp = APIBlueprint('questions', __name__, url_prefix='/questions')

@questions_bp.post("/create",summary="创建问答", tags=[questions_tag], responses={200: Resp})
def create_question(body: QuestionRequest):
    ba_question_range = BaQuestionRange(question=body.question, answer=body.answer,hit_number=0)
    with app.db.auto_commit_db():
        app.db.session.add(ba_question_range)
        app.db.session.flush()
        # 嵌入问题
        app.question_range_store.embedding_question(BmosQuestionRankTask(question_range_id=ba_question_range.id, content=body.question))
    return Resp.success()

@questions_bp.post("/query",summary="问题列表分页查询", tags=[questions_tag], responses={200: Resp[QuestionQueryResponse]})
def page_query(body: QuestionQueryRequest):
    # 构建基础查询
    query = BaQuestionRange.query

    # 添加筛选条件
    if body.question:
        query = query.filter(BaQuestionRange.question.like(f"%{body.question}%"))
    if body.answer:
        query = query.filter(BaQuestionRange.answer.like(f"%{body.answer}%"))

    # 执行分页查询
    pagination = query.paginate(
        page=body.page_num,
        per_page=body.page_size,
        error_out=False  # 页码超出范围不报错，返回空结果
    )

    pagination.items = [
        QuestionQueryResponse(
            id=str(questionRange.id),
            question=questionRange.question,
            answer=questionRange.answer,
            mark_time=questionRange.create_time,
            hit_number=questionRange.hit_number
        )
        for questionRange in pagination.items
    ]
    return Resp.success(PageResponse(pagination))

@questions_bp.put("/update",summary="编辑问答", tags=[questions_tag], responses={200: Resp})
def update_question(body: QuestionRequest):
    with app.db.auto_commit_db():
        ba_question_range = BaQuestionRange.query.get(body.id)
        if body.question is not None:
            ba_question_range.question_content = body.question
        if body.answer is not None:
            ba_question_range.answer = body.answer
        app.db.session.flush()
        app.question_range_store.embedding_question(BmosQuestionRankTask(question_range_id=ba_question_range.id, content=body.question))
    return Resp.success()


@questions_bp.delete("/remove", summary="删除问答", tags=[questions_tag], responses={200: Resp})
def remove_question(body: IdDTO):
    with app.db.auto_commit_db():
        ba_question_range = BaQuestionRange.query.get(body.id)
        app.db.session.delete(ba_question_range)
        app.question_range_store.delete_question([ba_question_range.id])
    return Resp.success()

@questions_bp.get("/retrieval", summary="问题召回测试", tags=[questions_tag], responses={200: Resp})
def retrieval(query: QuestionRangeRetrievalQuery) -> list[BmosQuestionRankRetrieval]:
    # 查询所有启用的问题
    result = app.question_range_store.retrieval_question(text=query.content)
    return Resp.success(result)
