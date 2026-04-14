# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 10:14
# @Author  : liang
# @FileName: knowledge_base_document_relationship.py.py
# @Software: PyCharm
"""标记调优"""
from datetime import datetime

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint
from loguru import logger
from sqlalchemy import text

from app.app_init import app
from app.auth.auth_content import get_context_user_id
from app.constants.constants.bable_constants import TRANSLATIONS
from app.entities.agent import BaAgent
from app.entities.conversation import BaConversation
from app.entities.tag import BaConversationTag
from app.exception.exception_handler import BmosException
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.tag import ConversationPageQuery, ConversationPageResult, \
    LikeOrDislike
from app.utils.user_util import get_user_name

tag_tag = Tag(name='标记调优')
tag_bp = APIBlueprint('tag', __name__, url_prefix='/conversation/tag')


@tag_bp.get('/page', summary="查询标记调优分页", tags=[tag_tag],
            responses={200: Resp[PageResponse[ConversationPageResult]]})
def query_conversation_page(query: ConversationPageQuery):
    q = (BaConversation.query.order_by(BaConversation.last_chat_time.desc())
         .add_entity(BaAgent).join(BaAgent, BaAgent.id == BaConversation.agent_id, isouter=True))
    if query.user_id:
        q = q.filter(BaConversation.user_id == query.user_id)
    pagination = q.paginate(page=query.page_num, per_page=query.page_size)
    ids = [int(s.id) for s, a in pagination.items]
    orm_sql = text("""
        SELECT conversation_id,
       COUNT(*) FILTER (WHERE tag_type = 'LIKE' and is_admin = TRUE)     AS admin_like_count,
       COUNT(*) FILTER (WHERE tag_type = 'LIKE' and is_admin = FALSE)    AS user_like_count,
       COUNT(*) FILTER (WHERE tag_type = 'DISLIKE' and is_admin = TRUE)  AS admin_like_count,
       COUNT(*) FILTER (WHERE tag_type = 'DISLIKE' and is_admin = FALSE) AS user_like_count,
       MAX(GREATEST(tag_time, update_time))         AS latest_update_time
        FROM ba_conversation_tag
        where delete_time is null and conversation_id in :conversation_id
        GROUP BY conversation_id
    """)
    result = app.db.session.execute(orm_sql.bindparams(conversation_id=tuple(ids))).fetchall()
    conv_dict = {str(r[0]): {
        'admin_tag_like_count': r[1],
        'user_like_count': r[2],
        'admin_tag_dislike_count': r[3],
        'user_tag_dislike_count': r[4],
        'latest_tag_time': r[5]
    } for r in result}

    items = []
    for ss, agent in pagination.items:
        res = ConversationPageResult(conversation_id=ss.id,
                                     conversation_name=ss.title,
                                     user_name=get_user_name(ss.create_user),
                                     agent_name=agent.name if agent else '',
                                     user_tag_like_count=0,
                                     user_tag_dislike_count=0,
                                     admin_tag_like_count=0,
                                     admin_tag_dislike_count=0,
                                     latest_tag_time=None)
        if conv_dict.get(ss.id):
            res.admin_tag_like_count = conv_dict[ss.id].get('admin_tag_like_count', 0)
            res.user_tag_like_count = conv_dict[ss.id].get('user_like_count', 0)
            res.admin_tag_dislike_count = conv_dict[ss.id].get('admin_tag_dislike_count', 0)
            res.user_tag_dislike_count = conv_dict[ss.id].get('user_tag_dislike_count', 0)
            res.latest_tag_time = conv_dict[ss.id].get('latest_tag_time')
        items.append(res)
    pagination.items = items
    return Resp.success(PageResponse(pagination))


@tag_bp.put('/tag', summary="赞踩(用户)", tags=[tag_tag], responses={200: Resp[str]})
def tag(body: LikeOrDislike):
    t = _tag(body, False)
    return Resp.success(t.id)


@tag_bp.put('/admin_tag', summary="赞踩(管理员)", tags=[tag_tag], responses={200: Resp})
def admin_tag(body: LikeOrDislike):
    t = _tag(body, True)
    return Resp.success(t.id)


@tag_bp.post('/send_tags', summary="下发标记优化模型", tags=[tag_tag], responses={200: Resp[int]})
def send_tags(body: IdDTO):
    # 查询conversation下的所有未下发的标记
    tags: list[BaConversationTag] = BaConversationTag.query.filter(BaConversationTag.conversation_id == body.id,
                                                                   BaConversationTag.send_time.is_(None)).all()
    if not tags:
        raise BmosException(_(TRANSLATIONS['tag_no_update_mark']))
    logger.info(f'下发标记优化模型, conversation_id:{body.id},tags:{[t.id for t in tags]}')
    for t in tags:
        t.send_time = datetime.now()
        t.send_user_id = get_context_user_id()
        with app.db.auto_commit_db():
            app.db.session.add(t)
            app.db.session.flush()
    return Resp.success(len(tags))


def _validate_tag_and_get(conversation_id, question_id, answer_id, tag_user_id, is_admin) -> BaConversationTag | None:
    return BaConversationTag.query.filter(BaConversationTag.conversation_id == conversation_id,
                                          BaConversationTag.question_id == question_id,
                                          BaConversationTag.answer_id == answer_id,
                                          BaConversationTag.tag_user_id == tag_user_id,
                                          BaConversationTag.is_admin == is_admin
                                          ).first()


def _tag(body: LikeOrDislike, is_admin: bool) -> BaConversationTag:
    """
    标记
    :param body: 标记参数
    :param is_admin: 是否为管理员标记
    :return: 更新后的标记对象
    """
    t = _validate_tag_and_get(body.conversation_id,
                              body.question_id,
                              body.answer_id,
                              get_context_user_id(),
                              is_admin)
    if t is not None:
        logger.info(f'{"管理员" if is_admin else "用户"}更新tag tag_id:{t.id}')
        t.tag_type = body.tag_type
        t.tag_time = datetime.now()
        t.tag_user_id = get_context_user_id()
        t.send_time = None
        t.send_user_id = None
    else:
        t = BaConversationTag(conversation_id=body.conversation_id,
                              question_id=body.question_id,
                              answer_id=body.answer_id,
                              tag_user_id=get_context_user_id(),
                              tag_type=body.tag_type,
                              tag_time=datetime.now(),
                              content=body.content,
                              content_type=body.content_type,
                              is_admin=is_admin)
        logger.info(f'{"管理员" if is_admin else "用户"}新增tag answer_id:{body.answer_id} tag_type: {body.tag_type}')
    with app.db.auto_commit_db():
        app.db.session.add(t)
        app.db.session.flush()
        return t
