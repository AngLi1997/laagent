# -*- coding: utf-8 -*-
# @Time    : 2025/3/27 14:42
# @Author  : liang
# @FileName: mcp_client.py
# @Software: PyCharm

"""
    Chat Control
"""
import json
import os
import time
from datetime import datetime

from flask import Response
from flask_babel import gettext as _
from flask_openapi3 import APIBlueprint, Tag
from flask_sse import Message
from langchain_community.tools import TavilySearchResults
from langchain_core.messages import HumanMessage, AIMessage, trim_messages
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from loguru import logger
from ollama import ResponseError

from app.app_init import app
from app.auth.auth_content import get_context_user_id
from app.constants.constants.bable_constants import TRANSLATIONS
from app.constants.enums.common_enum import EnableStatus
from app.constants.enums.llm_enum import KeyTypeEnum
from app.constants.enums.review_enums import HandleMethodEnum
from app.core.agent.flow.agent_pool import agent_pool
from app.core.agent.messages.messages import StartMessage, EndMessage, BaseMessage, SearchOnlineResultMessage, \
    TextMessage, RecommendedQuestionMessage, ErrorMessage
from app.entities.agent import BaAgent
from app.entities.conversation import BaQuestion, BaConversation, BaAnswer
from app.entities.llm import BaLLM
from app.entities.question_range import BaQuestionRange
from app.exception.exception_handler import TerminalException, BmosException
from app.models.common.resp import Resp
from app.models.conversation import ChatSSEQuery
from app.models.llm import ModelCallingRequest, SessionMemoryManager
from app.sensitive_word.sensitive_base import check_base_sensitive_word
from app.sensitive_word.sensitive_word_context import check_sensitive_word, handle_sensitive_word, \
    get_has_straight_answer
from app.utils.llm_util import generate_recommended_questions
from app.utils.snowflake import IdUtil

chat_tag = Tag(name='chat接口')
chat_bp = APIBlueprint('chat', __name__, url_prefix='/chat/sse')

os.environ['TAVILY_API_KEY'] = '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'
search = TavilySearchResults(max_results=4, exclude_domains=["https://m.bendibao.com"])

memory_manager = SessionMemoryManager()


@chat_bp.post('/generate', summary='对话', tags=[chat_tag])
def generate_token(form: ChatSSEQuery):

    agent = BaAgent.query.get(form.agent_id)

    if not agent:
        return Resp.fail(_(TRANSLATIONS['agent_not_exist']))

    if agent.status == EnableStatus.DISABLE:
        return Resp.fail(_(TRANSLATIONS['agent_not_enable']))

    start_time = time.time()
    conversation = _get_or_create_conversation(form.input, form.conversation_id, form.agent_id, get_context_user_id())
    question = BaQuestion(
        question_content=app.json.dumps({'content': form.input, 'search_on_line': form.search_on_line}),
        conversation_id=conversation.id)
    # 保存对话/问题
    app.db.session.add(question)
    app.db.session.commit()

    question_id = question.id
    conversation_id = conversation.id
    answer_id = str(IdUtil.generate_id())

    # 所有消息 作为一个答案
    all_message = []
    last_time = datetime.now()

    graph = agent_pool.get_agent_graph(form.agent_id)

    sensitive_cache = []

    # 流式输出
    def stream():


        def __append(message: BaseMessage):
            """追加消息"""
            message.question_id = question_id
            message.answer_id = answer_id
            if not message.conversation_id:
                message.conversation_id = conversation_id
            if not message.during:
                nonlocal last_time
                message.during = (last_time - datetime.now()).microseconds // 1000
                last_time = datetime.now()

            # 敏感词拦截(回答过程中的敏感词)
            if isinstance(message, TextMessage):
                sensitive_cache.append(message.content)
                if len(sensitive_cache) > 10:
                    sensitive_cache.pop(0)
                tokens = "".join(sensitive_cache)
                # 优先匹配系统内置敏感词
                check_base_sensitive_word(tokens, question_id, answer_id, conversation_id)
                # 自定义敏感词
                token_warns = check_sensitive_word(tokens)
                straight_answer = get_has_straight_answer(token_warns)
                if straight_answer:
                    logger.info(f'直接返回:[{straight_answer}]')
                    raise TerminalException(straight_answer)
                for _, s_id, w, _ in token_warns:
                    message.content = handle_sensitive_word(message.content, w, s_id, conversation_id, question_id, answer_id, sensitive_cache)
                    # 添加到消息列表

            all_message.append(__clear_msg_dict(message.model_dump()))
            return str(Message(message.model_dump_json(), type='message'))

        def __finished_answer():
            end_time = time.time()
            # 保存回答
            answer = BaAnswer(
                _id=answer_id,
                conversation_id=conversation_id,
                question_id=question_id,
                question=form.input,
                answer_content=app.json.dumps(all_message),
                during=round(end_time - start_time, 3))
            with app.app_context():
                app.db.session.add(answer)
                app.db.session.commit()

        try:
            # 开始
            yield __append(StartMessage())

            # 问题靶场拦截 阈值 0.8
            qrs = app.question_range_store.retrieval_question(text=form.input, top_k=1, score_threshold=0.85)
            if qrs:
                question_range = qrs[0]
                logger.info(
                    f'检测到问题靶场存在预设的问题:[{question_range.content} => {question_range.answer} 相似度:[{question_range.score}]]')
                with app.app_context():
                    BaQuestionRange.query.filter(BaQuestionRange.id == question_range.question_range_id).update(
                        {BaQuestionRange.hit_number: BaQuestionRange.hit_number + 1})
                    app.db.session.commit()
                yield __append(TextMessage(content=question_range.answer))
                yield __append(TextMessage(
                    content='\n<div style="font-size: 12px; color: rgb(40, 113, 255)">————来自问题靶场</div>'))
                yield __append(EndMessage())
                __finished_answer()
                return

            # 优先匹配系统内置敏感词
            check_base_sensitive_word(form.input, question_id, answer_id, conversation_id)
            # 开始关键词拦截（问题包含敏感词）
            warns = check_sensitive_word(form.input)
            for index, sensitive_id, word, method in warns:
                if method == HandleMethodEnum.STRAIGHT_ANSWER:
                    logger.info(f'检测到需要直接回复的敏感词:[{word}], 匹配项id:[{sensitive_id}]')
                    yield __append(TextMessage(content=handle_sensitive_word(form.input, word,
                                                                             sensitive_id, conversation_id,
                                                                             question_id)))
                    # 直接结束
                    yield __append(EndMessage())
                    __finished_answer()
                    return

            # 在线搜索
            search_results = []
            search_results_messages = []
            if form.search_on_line:
                search_results = search.invoke(form.input)
                # for sr in search_results:
                #     sr['content'] = sr['content'].encode("latin-1")
                #     sr['content'] = sr['content'].decode("utf-8")
                logger.info(f'在线搜索结果: {search_results}')
                if isinstance(search_results, list):
                    search_results_messages = [
                        SearchOnlineResultMessage(engine='tavily', title=result['title'], result=result['content'],
                                                  url=result['url'])
                        for result in search_results]
                for sr in search_results_messages:
                    yield __append(sr)

            answer_tokens = ""
            with app.app_context():
                """这里正式调用LLM接口!!!"""
                for message in graph.stream({"input": form.input, "search_results": search_results}, config={"configurable": {"thread_id": conversation_id}}, stream_mode="custom"):
                    if isinstance(message, TextMessage):
                        answer_tokens += message.content
                    yield __append(message)

            logger.info(f'正在生成推荐问题')
            # 推荐问题
            recommended_questions = generate_recommended_questions(form.input, answer_tokens, 3)
            logger.info(f'推荐问题：{recommended_questions}')
            if recommended_questions:
                yield __append(RecommendedQuestionMessage(questions=recommended_questions))
            # 结束
            yield __append(EndMessage())
            __finished_answer()
        except ResponseError as e:
            logger.error(f'llm配置异常: {e}')
            yield __append(ErrorMessage(error=e.error))
            yield __append(EndMessage())
            __finished_answer()
        except TerminalException as e:
            logger.error(f'会话终止: {e}')
            yield __append(ErrorMessage(content=e.message, error=e.message))
            yield __append(EndMessage())
            __finished_answer()

    return Response(stream(), mimetype='text/event-stream')

@chat_bp.post('/test', summary="模型测试", tags=[chat_tag])
def model_call_request(form: ModelCallingRequest):
    llm_config = BaLLM.query.get(form.id)
    if not llm_config:
        raise BmosException(_(TRANSLATIONS['llm_not_exist']))
    data = json.loads(llm_config.temperature)

    user_id = get_context_user_id()
    print(f"user_id: {user_id}")

    if KeyTypeEnum.OLLAMA == llm_config.key_type:
        global_llm = ChatOllama(base_url=llm_config.url, model=f"{llm_config.name}", **data)
    elif KeyTypeEnum.OPENAI == llm_config.key_type:
        global_llm = ChatOpenAI(base_url=llm_config.url,model= f"{llm_config.name}",api_key=llm_config.api_key, **data)
    else:
        raise BmosException("不支持的模型类型！")

    def stream():
        def __append(message: BaseMessage):
            return str(Message(message.model_dump_json(), type='message'))

        try:
            yield __append(StartMessage())

            # 根据用户id划分内存消息
            history = memory_manager.get_messages(user_id)

            new_messages = history + [HumanMessage(content=form.message)]

            trimmed = trim_messages(
                new_messages,
                max_tokens=5,
                strategy="last",
                start_on="human",
                include_system=True,
                token_counter=len
            )

            full_response = []
            for chunk in global_llm.stream(trimmed):
                full_response.append(chunk.content)
                yield __append(TextMessage(content=chunk.content))

            # 更新内存消息
            updated_history = trimmed + [AIMessage(content=''.join(full_response))]
            memory_manager.save_messages(user_id, updated_history)

            yield __append(EndMessage())
        except TerminalException as e:
            logger.error(f'会话终止: {e}')
            yield __append(ErrorMessage(content=e.message, error=e.message))
            yield __append(EndMessage())

    return Response(stream(), mimetype='text/event-stream')


def _get_or_create_conversation(input_: str | None, conversation_id: str | None, agent_id: str,
                                user_id: str) -> BaConversation:
    if conversation_id:
        conv = BaConversation.query.get(conversation_id)
        if conv:
            return conv
    conv = BaConversation(_id=conversation_id,
                          title=input_,
                          agent_id=agent_id,
                          user_id=user_id,
                          last_chat_time=datetime.now())
    app.db.session.add(conv)
    app.db.session.flush()
    return conv


def build_system_prompt(search_online_results: [], knowledge_base_result: []) -> str:
    search_prompt = ""
    knowledge_base_prompt = ""
    if knowledge_base_result:
        knowledge_base_prompt = f"\n以下是搜索知识库结果:\n{knowledge_base_result}\n"
    if search_online_results:
        search_prompt = f"\n以下是搜索网页结果:\n{search_online_results}\n"
    system_prompt = (f"{knowledge_base_prompt}\n"
                     f"{search_prompt}\n"
                     f"请{'结合' if search_online_results and knowledge_base_result else ''}"
                     f"{'[知识库搜索结果]' if knowledge_base_result else ''}"
                     f"{'[在线搜索结果]' if search_online_results else ''}"
                     f"回答用户的问题\n"
                     f"1、必须基于用户的问题回答\n"
                     f"2、如果用户问题无法解决，可以输出提示用户问题无法解决\n"
                     f"3、保证问题的有效且真实，不许编造回答\n")
    return system_prompt


def __clear_msg_dict(d: dict) -> dict:
    """回显消息时过滤多余的字段"""
    if d.get('conversation_id'):
        del d['conversation_id']
    if d.get('question_id'):
        del d['question_id']
    if d.get('answer_id'):
        del d['answer_id']
    return d
