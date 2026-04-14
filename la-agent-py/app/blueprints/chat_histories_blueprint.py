from datetime import datetime, time

from flask_openapi3 import Tag, APIBlueprint

from app.database.page_sql_helper import custom_sql_pagination
from app.models.chatlog import ChatHistoriesQuery, ChatHistoriesPageResult
from app.models.common.page import PageResponse
from app.models.common.resp import Resp
from app.utils.user_util import get_user_name

chat_log_tag = Tag(name='对话日志')
chat_log_bp = APIBlueprint('chat_log', __name__, url_prefix='/chat/log')


@chat_log_bp.get('/page', tags=[chat_log_tag], description='对话日志分页查询', summary='对话日志分页查询',
                 responses={200: Resp[PageResponse[ChatHistoriesPageResult]]})
def query_page(query: ChatHistoriesQuery):
    sql = f"""
        select ba_conversation.id::text                                                                         as conversation_id,
               ba_agent.name                                                                                    as agent_name,
               ba_conversation.user_id,
               ba_conversation.title,
               ba_conversation.last_chat_time,
               (select count(ba_answer.id) from ba_answer where ba_answer.conversation_id = ba_conversation.id) as reply_count,
               coalesce(tags.admin_tag_like_count, 0) as admin_tag_like_count,
               coalesce(tags.user_tag_like_count, 0) as user_tag_like_count,
               coalesce(tags.admin_tag_dislike_count, 0) as admin_tag_dislike_count,
               coalesce(tags.user_tag_dislike_count, 0) as user_tag_dislike_count,
               string_agg(distinct ba_sensitive_history.keyword_group, ',')                                     as keyword_group,
               string_agg(distinct ba_sensitive_history.keyword, ',')                                           as hit_word
        from ba_conversation
                 left join ba_agent on ba_conversation.agent_id = ba_agent.id
                 left join ba_sensitive_history on ba_conversation.id = ba_sensitive_history.conversation_id and
                                                   ba_sensitive_history.delete_time is null
                 left join (SELECT conversation_id,
                                   COUNT(*) FILTER (WHERE tag_type = 'LIKE' AND is_admin = true)    AS admin_tag_like_count,
                                   COUNT(*) FILTER (WHERE tag_type = 'LIKE' AND is_admin = false)     AS user_tag_like_count,
                                   COUNT(*) FILTER (WHERE tag_type = 'DISLIKE' AND is_admin = true)   AS admin_tag_dislike_count,
                                   COUNT(*) FILTER (WHERE tag_type = 'DISLIKE' AND is_admin = false)  AS user_tag_dislike_count
                            FROM ba_conversation_tag
                            GROUP BY ba_conversation_tag.conversation_id) tags on ba_conversation.id = tags.conversation_id
        where ba_conversation.delete_time is null
        """
    condition = dict()
    if query.agent_name:
        sql += " and ba_agent.name like :agent_name"
        condition.update(agent_name=f"%{query.agent_name}%")
    if query.title:
        sql += " and ba_conversation.title like :title"
        condition.update(title=f"%{query.title}%")
    if query.keyword_group:
        sql += " and ba_sensitive_history.keyword_group like :keyword_group"
        condition.update(keyword_group=f"%{query.keyword_group}%")
    if query.last_chat_end_time is not None and query.last_chat_start_time is not None:
        sql += " and ba_conversation.last_chat_time between :last_chat_start_time and :last_chat_end_time"
        condition.update(last_chat_start_time=datetime.combine(query.last_chat_start_time, time.min), last_chat_end_time=datetime.combine(query.last_chat_end_time, time.max))
    if query.user_id:
        sql += " and ba_conversation.user_id = :user_id"
        condition.update(user_id=query.user_id)
    sql += """ GROUP BY
        ba_conversation.id,
        ba_conversation.title,
        ba_agent.name,
        ba_conversation.user_id,
        ba_conversation.last_chat_time,
        tags.admin_tag_like_count,
        tags.user_tag_like_count,
        tags.admin_tag_dislike_count,
        tags.user_tag_dislike_count
        order by ba_conversation.last_chat_time desc
    """
    # 使用自定义sql分页
    page = custom_sql_pagination(sql, cls=ChatHistoriesPageResult, params=condition, page=query.page_num, per_page=query.page_size)
    items: list[ChatHistoriesPageResult] = page.get('items', [])
    for item in items:
        item.user_name = get_user_name(item.user_id)
    return Resp.success(PageResponse(page))
