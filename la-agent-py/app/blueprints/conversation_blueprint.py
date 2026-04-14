# -*- coding: utf-8 -*-
# @Time    : 2025/4/14 10:12
# @Author  : liang
# @FileName: knowledge_base_document_relationship.py.py
# @Software: PyCharm
"""会话信息"""
from datetime import datetime

from flask_babel import gettext as _
from flask_openapi3 import Tag, APIBlueprint
from loguru import logger
from sqlalchemy import and_
from sqlalchemy.orm import aliased

from app.app_init import app
from app.auth.auth_content import get_context_user_id
from app.constants.constants.bable_constants import TRANSLATIONS
from app.core.agent.flow.memory_manager import memory_manager
from app.entities.agent import BaAgent
from app.entities.conversation import BaConversation, BaAnswer
from app.entities.tag import BaConversationTag
from app.entities.user_config import BaUserConfig
from app.exception.exception_handler import BmosException
from app.models.common.common_dto import IdDTO
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.models.conversation import ChatHistoryPageResponse, ChatHistoryPageQuery, \
    ChatHistoryInfo, ChatHistoryMessageView, ChatLatestAgent, EditConversationQuery

conversation_tag = Tag(name='对话管理')
conversation_bp = APIBlueprint('conversation', __name__, url_prefix='/conversation')


@conversation_bp.get('/page', tags=[conversation_tag], summary='分页查询当前登录人的对话历史记录',
                     responses={200: Resp[PageResponse[ChatHistoryPageResponse]]})
def page(query: ChatHistoryPageQuery):
    q = (BaConversation.query.order_by(BaConversation.last_chat_time.desc())
         .add_entity(BaAgent).join(BaAgent, BaAgent.id == BaConversation.agent_id, isouter=True)
         .filter(BaConversation.user_id == get_context_user_id(), BaConversation.user_delete_time.is_(None)))

    # 模糊搜索
    if query.conversation_title:
        q = q.filter(BaConversation.title.like(f'%{query.conversation_title}%'))

    # 分页查询
    pagination = q.paginate(page=query.page_num, per_page=query.page_size, error_out=False)
    pagination.items = [ChatHistoryPageResponse(
        agent_name=agent.name if agent else '',
        agent_avatar=agent.icon_url if agent else '',
        conversation_id=conv.id,
        conversation_title=conv.title,
        last_chat_time=conv.last_chat_time.strftime('%Y-%m-%d')
    ) for conv, agent in pagination.items]
    return Resp.success(PageResponse(pagination))


@conversation_bp.delete('/clear', tags=[conversation_tag], summary='删除历史记录',
                        responses={200: Resp[str]})
def clear(query: IdDTO):
    conversation = BaConversation.query.filter(BaConversation.id == query.id,
                                               BaConversation.user_delete_time.is_(None)).first()
    if not conversation:
        raise BmosException(_(TRANSLATIONS['chat_id_not_exist'], id=query.id))
    logger.info(f'用户删除对话历史记录: conversation_id: {conversation.id}')
    BaConversation.query.filter(BaConversation.id == query.id).update({
        'user_delete_time': datetime.now()
    })
    app.db.session.commit()

    # 清楚记忆 清除后无法继续对话
    memory_manager.clear_memory(conversation.id)
    return Resp.success(query.id)


@conversation_bp.delete('/clear_all', tags=[conversation_tag], summary='删除全部历史记录',
                        responses={200: Resp[list[str]]})
def clear_all():
    conversations = (BaConversation.query
                     .filter(BaConversation.user_delete_time.is_(None))
                     .filter(BaConversation.user_id == get_context_user_id())
                     .all())
    if not conversations:
        raise BmosException(_(TRANSLATIONS['chat_history_not_exist']))
    conversation_ids = [c.id for c in conversations]
    logger.info(f'用户清空对话历史记录: conversation_ids: {conversation_ids}')
    BaConversation.query.filter(BaConversation.id.in_(conversation_ids)).update({
        'user_delete_time': datetime.now()
    })
    for con_id in conversation_ids:
        memory_manager.clear_memory(con_id)
    app.db.session.commit()
    return Resp.success()


@conversation_bp.get('/get_info', tags=[conversation_tag], summary='获取对话历史详情',
                     responses={200: Resp[ChatHistoryInfo]})
def get_info(query: IdDTO):
    conversation = (BaConversation.query.filter(BaConversation.id == query.id)
                    .first())
    if not conversation:
        raise BmosException(_(TRANSLATIONS['chat_id_not_exist'], id=query.id))

    user_id = conversation.user_id
    buc = BaUserConfig.query.get(user_id)
    agent = BaAgent.query.execution_options(include_deleted=True).get(conversation.agent_id)
    if not agent:
        raise BmosException(_(TRANSLATIONS['chat_id_relevancy_agent_not_exist'],
                              id=query.id, agent_id=conversation.agent_id))
    admin_tag = aliased(BaConversationTag)
    user_tag = aliased(BaConversationTag)
    answers = (BaAnswer.query.order_by(BaAnswer.create_time.asc())
               .add_entity(admin_tag)
               .add_entity(user_tag)
               .join(admin_tag, and_(admin_tag.answer_id == BaAnswer.id, admin_tag.is_admin == True), isouter=True)
               .join(user_tag, and_(user_tag.answer_id == BaAnswer.id, user_tag.is_admin == False), isouter=True)
               .filter(BaAnswer.conversation_id == query.id).all())
    info = ChatHistoryInfo(conversation_id=conversation.id,
                           conversation_title=conversation.title,
                           agent_id=agent.id,
                           agent_name=agent.name,
                           agent_avatar=agent.icon_url,
                           user_avatar=buc.icon_url if buc else None,
                           last_chat_time=conversation.last_chat_time.strftime('%Y-%m-%d'),
                           chats=[ChatHistoryMessageView(answer_id=answer.id,
                                                         question_id=answer.question_id,
                                                         question=answer.question,
                                                         answer_messages_list=merge_text_message(
                                                             app.json.loads(answer.answer_content)),
                                                         user_tag_type=user_tag.tag_type if user_tag else None,
                                                         admin_tag_type=admin_tag.tag_type if admin_tag else None
                                                         ) for answer, admin_tag, user_tag in answers])

    return Resp.success(info)


@conversation_bp.get('/get_last_agent', tags=[conversation_tag], summary='获取最近使用的智能体id',
                     responses={200: Resp[ChatLatestAgent]})
def get_last_agent():
    conversation = (BaConversation.query.order_by(BaConversation.last_chat_time.desc())
                    .filter(BaConversation.user_id == get_context_user_id(), BaConversation.user_delete_time.is_(None))
                    .first())
    if not conversation:
        return Resp.success()
    agent = BaAgent.query.get(conversation.agent_id)
    if not agent:
        return Resp.success()
    return Resp.success(ChatLatestAgent(agent_id=agent.id, agent_name=agent.name, agent_avatar=agent.icon_url))


@conversation_bp.put('/edit_title', tags=[conversation_tag], summary='更新对话标题',
                     responses={200: Resp[ChatLatestAgent]})
def edit_title(body: EditConversationQuery):
    conversation = BaConversation.query.get(body.conversation_id)
    if not conversation:
        raise BmosException(_(TRANSLATIONS['chat_id_not_exist'], id=body.conversation_id))

    with app.db.auto_commit_db():
        BaConversation.query.filter(BaConversation.id == body.conversation_id).update({
            'title': body.conversation_title
        })
    return Resp.success(body.conversation_title)


def merge_text_message(li: list[dict]):
    from collections import OrderedDict
    res = []
    groups = OrderedDict()

    for item in li:
        key = (item.get("message_type"), item.get("node_id"))
        if item['message_type'] == 'text':
            if key in groups:
                groups[key]['content'] += item['content']
                groups[key]['during'] += item['during']
            else:
                groups[key] = item.copy()  # 创建新引用以避免修改原始对象
        else:
            # 插入非 text 类型元素前，先检查是否有未提交的组
            if key in groups:
                # 遇到相同 message_type 和 node_id 的 text 消息时合并
                groups.move_to_end(key)  # 保持顺序
            else:
                groups[key] = item

    # 按照 OrderedDict 中的键值顺序返回合并结果
    return list(groups.values())