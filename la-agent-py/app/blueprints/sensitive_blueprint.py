from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint
from sqlalchemy.sql.functions import count

from app.app_init import app
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.review_enums import HandleMethodEnum
from app.entities.review import BaSensitive, BaSensitiveHistory
from app.exception.exception_handler import BmosException
from app.models.common.page import PageResponse, PageRequest
from app.models.common.resp import Resp
from app.models.review import ChatSensitiveCreateDTO, ChatReviewQuery, ChatReviewPageResult, \
    ChatReviewDetailResult, ChatSensitiveUpdateDTO, ChatReviewOperateDTO, ChatReviewPath, SensitiveHistory
from app.sensitive_word.sensitive_word_context import load_sensitive_words

chat_review_tag = Tag(name='内容审查')
chat_review_bp = APIBlueprint('sensitive', __name__, url_prefix='/chat/review')


@chat_review_bp.post('/create', tags=[chat_review_tag], description='创建内容审查', summary='创建内容审查',
                     responses={200: Resp[int]})
def create(body: ChatSensitiveCreateDTO):
    if body.handle_method == HandleMethodEnum.STRAIGHT_ANSWER and body.canned_answer is None:
        raise BmosException(_(TRANSLATIONS['review_preset_answer_not_empty']))
    text = __handle_input(body.keyword_group)
    chat_review = BaSensitive(body.word_group, body.handle_method, text, body.canned_answer, 0, False)
    with app.db.auto_commit_db():
        app.db.session.add(chat_review)
    return Resp.success(chat_review.id)


@chat_review_bp.put('/update', tags=[chat_review_tag], description='更新内容审查', summary='更新内容审查',
                    responses={200: Resp})
def update(body: ChatSensitiveUpdateDTO):
    chat_review = app.db.session.query(BaSensitive).filter_by(id=body.id).first()
    if not chat_review:
        raise BmosException(_(TRANSLATIONS['review_not_exist']))
    text = __handle_input(body.keyword_group)
    chat_review.canned_answer = body.canned_answer
    chat_review.handle_method = body.handle_method
    chat_review.keyword_group = text
    chat_review.word_group = body.word_group
    with app.db.auto_commit_db():
        app.db.session.merge(chat_review)
        app.db.session.flush()
    load_sensitive_words()
    return Resp.success()


@chat_review_bp.put('/operate/<int:chat_review_id>', tags=[chat_review_tag], description='停/启用', summary='停/启用',
                    responses={200: Resp})
def operate(path: ChatReviewPath, body: ChatReviewOperateDTO):
    chat_review = app.db.session.query(BaSensitive).filter_by(id=path.chat_review_id).first()
    if not chat_review:
        raise BmosException(_(TRANSLATIONS['review_not_exist']))
    chat_review.enable = body.enable
    with app.db.auto_commit_db():
        app.db.session.merge(chat_review)
        app.db.session.flush()
    load_sensitive_words()
    return Resp.success()


@chat_review_bp.delete('/delete/<int:chat_review_id>', tags=[chat_review_tag], description='删除', summary='删除',
                       responses={200: Resp})
def delete(path: ChatReviewPath):
    chat_review = app.db.session.query(BaSensitive).filter_by(id=path.chat_review_id).first()
    if not chat_review:
        raise BmosException(_(TRANSLATIONS['review_not_exist']))
    if chat_review.id == 0:
        raise BmosException("内置敏感词不允许删除")
    with app.db.auto_commit_db():
        app.db.session.delete(chat_review)
        app.db.session.flush()
    load_sensitive_words()
    return Resp.success()


@chat_review_bp.get('/page', tags=[chat_review_tag], description='分页查询内容审查', summary='分页查询内容审查',
                    responses={200: Resp[PageResponse[ChatReviewPageResult]]})
def page(query: ChatReviewQuery):
    ba_chat_review_query = (BaSensitive.query.order_by(BaSensitive.create_time.desc())
                            .add_column(count(BaSensitiveHistory.id))
                            .join(BaSensitiveHistory, BaSensitiveHistory.sensitive_id == BaSensitive.id, isouter=True)
                            .group_by(BaSensitive.id))
    if query.word_group:
        ba_chat_review_query.filter(BaSensitive.word_group.like(f'%{query.word_group}%'))
    pagination = ba_chat_review_query.paginate(page=query.page_num, per_page=query.page_size)
    pagination.items = [ChatReviewPageResult(**chat_review.__dict__, hit_count=c) for chat_review, c in
                        pagination.items]
    return Resp.success(PageResponse(pagination))


@chat_review_bp.get('/detail/<int:chat_review_id>', tags=[chat_review_tag], description='内容审查详情',
                    summary='内容审查详情', responses={200: Resp[ChatReviewDetailResult]})
def detail(path: ChatReviewPath):
    chat_review = app.db.session.query(BaSensitive).filter_by(id=path.chat_review_id).first()
    if not chat_review:
        raise BmosException(_(TRANSLATIONS['review_not_exist']))
    return Resp.success(ChatReviewDetailResult.model_validate(chat_review.__dict__))


@chat_review_bp.get('/interception/record/<int:chat_review_id>', tags=[chat_review_tag], description='拦截记录',
                    summary='拦截记录', responses={200: Resp[PageResponse[SensitiveHistory]]})
def interception_record(path: ChatReviewPath, query: PageRequest):
    q = BaSensitiveHistory.query.order_by(BaSensitiveHistory.create_time.desc()).filter(
        BaSensitiveHistory.sensitive_id == path.chat_review_id)
    pagination = q.paginate(page=query.page_num, per_page=query.page_size, error_out=False)
    pagination.items = [SensitiveHistory(chat_review_id=item.sensitive_id,
                                         message=item.input,
                                         hit_keyword=item.keyword) for item in pagination.items]
    return Resp.success(PageResponse(pagination))


def __handle_input(text: str):
    text = (text
            # 换行
            .replace('\n', ',')
            # 空格
            .replace(' ', ','))
    lst = text.split(',')
    return ','.join([word for word in lst if word != ''])
