# -*- coding: utf-8 -*-
# @Time    : 2025/4/18 10:32
# @Author  : liang
# @FileName: knowledge_base_document_relationship.py.py
# @Software: PyCharm
from flask_openapi3 import Tag, APIBlueprint
from loguru import logger

from app.app_init import app
from app.auth.auth_content import get_context_user_name, get_context_user_id
from app.entities.feedback import BaFeedback, BaFeedbackReply
from app.models.common.resp import Resp
from app.models.feedback import UserFeedbackDTO, FeedbackHistory, FeedbackReplyHistory
from app.utils.user_util import get_user_name

feedback_tag = Tag(name='用户反馈')
feedback_bp = APIBlueprint('feedback', __name__, url_prefix='/feedback')


@feedback_bp.post('/create_feedback', tags=[feedback_tag], summary='新增用户反馈(用户)', responses={200: Resp})
def create_feedback(body: UserFeedbackDTO):
    logger.info(f'用户{get_context_user_name()}新增反馈: {body}')
    feedback = BaFeedback(msg=body.msg, user_id=get_context_user_id(), conversation_id=body.conversation_id)
    app.db.session.add(feedback)
    app.db.session.commit()
    return Resp.success()


@feedback_bp.post('/list_feedback_history', tags=[feedback_tag], summary='查看反馈记录(用户)', responses={200: Resp[list[FeedbackHistory]]})
def list_feedback_history():

    # 查询个人反馈
    feedbacks = (BaFeedback.query.order_by(BaFeedback.create_time)
                 .filter(BaFeedback.user_id == get_context_user_id()).all())

    if not feedbacks:
        return Resp.success([])
    feedback_ids = [feedback.id for feedback in feedbacks]

    # 查询回复
    replies = (BaFeedbackReply.query.order_by(BaFeedbackReply.create_time)
     .filter(BaFeedbackReply.feedback_id.in_(feedback_ids))).all()
    # 分组
    replies_map = {}
    for reply in replies:
        replies_map.setdefault(reply.feedback_id, []).append(reply)

    results = [FeedbackHistory(id=feedback.id, feedback_time=feedback.create_time, msg=feedback.msg, replies=[
        FeedbackReplyHistory(id=reply.id,
                             reply_msg=reply.reply_msg,
                             reply_time=reply.create_time,
                             reply_user=get_user_name(reply.reply_user_id)) for reply in replies_map.get(feedback.id, [])
    ]) for feedback in feedbacks]
    return Resp.success(results)