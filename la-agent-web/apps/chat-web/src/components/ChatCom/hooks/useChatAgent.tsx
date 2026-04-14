import type { FeedbackModalRef } from '@/components/FeedbackModal';
import type { FeedbackModalType } from '@/components/FeedbackModal/type';
import type { AttachmentsProps, Bubble } from '@ant-design/x';
import type { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import type { GetProp } from 'antd';
import type { DocumentLinkMessage, MessageInfoType, SearchOnlineMessage, ToolCallingMessage } from '../type';
import { adminTag, AgentChat, getConversationInfo, ModelChat, userTag } from '@/api/chat';
import DocumentLink from '@/components/DocumentLink';
import { FeedbackType } from '@/components/FeedbackModal/type';
import Markdown from '@/components/MarkdownRenderer';
import RecommendedQuestion from '@/components/RecommendedQuestion';
import SvgIcon from '@/components/SvgIcon';
import ToolChain from '@/components/ToolChain';
import { useAgentStore } from '@/stores/agent';
import { Attachments, useXAgent, useXChat, XStream } from '@ant-design/x';
import { t } from '@bmos/i18n';
import { isEmpty, isString } from '@bmos/utils';
import { App, Button, Flex } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MessageType } from '../type';
import { handleAgentMessage, handleMessage } from '../utils/handleMessage';

export const useChatAgent = (canLike: boolean) => {
  const { message } = App.useApp();

  const { setAgent } = useAgentStore();
  // 对话信息
  const [conversationInfo, setConversationInfo] = useState<{
    agent_id?: string | undefined;
    agent_avatar?: string | undefined;
    user_avatar?: string | undefined;
    conversation_id?: string | undefined;
    name?: string | undefined;
    model_id?: string | undefined;
  } | null
  >({});

  useEffect(() => {
    if (conversationInfo?.conversation_id) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', conversationInfo.conversation_id);
      conversationInfo.agent_id && url.searchParams.set('agentId', conversationInfo.agent_id as string);
      history.replaceState(null, '', url.toString());
    }
  }, [conversationInfo]);

  // 是否展开
  const [openAttachment, setOpenAttachment] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');

  // 反馈弹窗ref
  const feedbackRef = useRef<FeedbackModalRef>(null);
  // 是否联网搜索
  const [online, setOnline] = useState(false);
  const onlineRef = useRef<'true' | 'false'>('false');
  useEffect(() => {
    onlineRef.current = online ? 'true' : 'false';
  }, [online]);
  const [content, setContent] = useState('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  // 附件
  const [fileItems, setFileItems] = useState<GetProp<AttachmentsProps, 'items'>>([]);

  const controller = useRef<AbortController>(new AbortController());

  /**
   * 发送请求
   * @param message
   */
  const sendRequest = async (message: MessageInfoType | undefined) => {
    const formData = new FormData();
    formData.append('agent_id', message?.agent_id as string);
    formData.append('input', message?.input as string);
    if (message?.conversation_id) {
      formData.append('conversation_id', message?.conversation_id as string);
    }
    // formData.append('input_files', message?.input_files?.join(',') || '');
    formData.append('search_on_line', onlineRef.current);
    controller.current = new AbortController();
    const response = await AgentChat(formData, controller.current.signal);
    return response.body;
  };

  const sendModelRequest = async (message: MessageInfoType | undefined) => {
    const formData = new FormData();
    formData.append('id', message?.model_id as string);
    formData.append('message', message?.input as string);
    controller.current = new AbortController();
    const response = await ModelChat(formData, controller.current.signal);
    return response.body;
  };

  const [agent] = useXAgent<
    MessageInfoType,
    { messages: MessageInfoType[]; message: MessageInfoType },
    MessageInfoType
  >({
    request: async ({ messages, message: chatMessage }, { onSuccess, onUpdate, onError }) => {
      // let content = '';
      // let msgInfo = {} as MessageInfoType;
      const messageMapRef = new Map<string, any>();

      let messageList: MessageInfoType[] = [];

      try {
        if (!chatMessage) {
          onError(new Error('请输入内容'));
          return;
        }
        // 🌟 Read the stream
        for await (const chunk of XStream({
          readableStream: isEmpty(chatMessage?.model_id)
            ? await sendRequest(chatMessage) as ReadableStream
            : await sendModelRequest(chatMessage) as ReadableStream,
        })) {
          if (chunk.data) {
            try {
              const reqMsg = JSON.parse(chunk.data) as MessageInfoType;
              // content += reqMsg.content ?? '';
              if (messages && messages.length <= 1 && reqMsg.conversation_id) {
                setConversationInfo(prev => ({
                  ...prev,
                  conversation_id: reqMsg.conversation_id as string,
                  name: chatMessage?.input,
                }));
              }
              // 处理错误消息
              // if (reqMsg.message_type === MessageType.error) {
              //   // @ts-ignore
              //   onUpdate([{ ...reqMsg, message_type: MessageType.text }]);
              //   onSuccess([{ ...reqMsg, message_type: MessageType.text }]);
              //   return;
              // }
              // 跳过开始消息
              if (reqMsg.message_type === MessageType.start) {
                continue;
              }
              messageList = handleMessage(reqMsg, {
                messageList,
                messageMapRef,
              });
              // 处理结束消息
              if (reqMsg.message_type === MessageType.end) {
                onSuccess(messageList);
                return;
              }
              // @ts-ignore
              onUpdate(messageList);
            }
            catch (error: any) {
              console.error('error', error);
              return;
            }
          };
        }
      }
      catch (error: any) {
        console.error('api error', error);
        if (error.message === 'BodyStreamBuffer was aborted') {
          onSuccess(messageList);
          return;
        }
        onError(error.message);
        error.message && message.error(error.message);
      }
    },
  });

  const { onRequest, parsedMessages, messages, setMessages } = useXChat({
    agent,
    parser: (message: MessageInfoType) => {
      return message;
    },
  });

  const onSubmit = async (nextContent: string) => {
    if (agent.isRequesting())
      return;
    if (!nextContent)
      return;
    setChatLoading(true);
    await onRequest({
      message_type: MessageType.user,
      conversation_id: conversationInfo?.conversation_id as string,
      agent_id: conversationInfo?.agent_id as string,
      model_id: conversationInfo?.model_id as string,
      input_files: fileItems,
      input: nextContent,
    });
    setContent('');
    setFileItems([]);
    setOpenAttachment(false);
    setChatLoading(false);
  };

  const onCancel = () => {
    setChatLoading(false);
    controller.current.abort();
  };

  // 点赞/踩
  const handleLike = (type: FeedbackType, id: string | number | undefined, index: number) => {
    if (parsedMessages[index].message.liked === type) {
      parsedMessages[index].message.liked = null;
      setMessages(parsedMessages);
      return;
    }
    feedbackRef.current?.showModal(type, id, index);
  };

  // 提交反馈
  const handleFeedback = async (data: FeedbackModalType) => {
    const msg = parsedMessages[data.index].message;
    const params = {
      question_id: msg.question_id,
      answer_id: msg.answer_id,
      conversation_id: conversationInfo?.conversation_id,
      tag_type: data.type,
      content_type: data.tags,
      content: data.feedback,
    };
    if (!window?.$wujie) {
      await userTag(params);
    }
    else {
      await adminTag(params);
    }
    parsedMessages[data.index].message.liked = data.type;
    setMessages(parsedMessages);
  };

  /**
   * 根据对话id获取对话信息
   * @param conversationId 对话id
   */
  const getConversation = async (conversationId: string) => {
    try {
      const { data } = await getConversationInfo({ id: conversationId });
      if (!data) {
        return;
      }
      setConversationInfo({
        agent_id: data.agent_id,
        agent_avatar: data.agent_avatar,
        user_avatar: data.user_avatar,
        conversation_id: data.conversation_id,
        name: data.conversation_title,
      });
      setAgent({
        id: data.agent_id,
        name: data.agent_name,
        icon_url: data.agent_avatar,
      });
      const msgList = handleAgentMessage(data.chats);
      setMessages(msgList);
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchResult, setSearchResult] = useState<SearchOnlineMessage[]>([]);

  const agentAvatar = isString(conversationInfo?.agent_avatar) && conversationInfo.agent_avatar.length > 0
    ? <img src={conversationInfo.agent_avatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
    : <SvgIcon name="DefaultAgentAvatar1" size={32} />;

  const showAvatar = (index: number) => {
    return parsedMessages[index - 1]?.status === 'local' ? agentAvatar : <img style={{ width: '32px', height: '32px', borderRadius: '50%', visibility: 'hidden' }} />;
  };

  // 角色
  // @ts-ignore
  const roles: GetProp<typeof Bubble.List, 'roles'> = (bubble: BubbleDataType & MessageInfoType, index: number) => {
    if (bubble.role === 'ai') { // ai
      return {
        placement: 'start',
        avatar: showAvatar(index),
        // typing: { step: 10, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
            minHeight: 'auto',
          },
        },
        messageRender: (content: string) => (<Markdown content={content} />),
      };
    }
    else if (bubble.role === MessageType.searchOnline) { // 联网搜索
      return {
        placement: 'start',
        avatar: showAvatar(index),
        typing: { step: 5, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
          },
        },
        messageRender: () => (!!bubble.search_online_result?.size && (
          <>
            <Button
              color="default"
              variant="filled"
              size="small"
              style={{ borderRadius: 8 }}
              onClick={() => {
                setDrawerOpen(true);
                const resList: SearchOnlineMessage[] = [];
                bubble.search_online_result?.forEach((item) => {
                  resList.push(item);
                });
                setSearchResult(resList);
              }}
            >
              <SvgIcon name="Search" size={14} />
              {t('已搜索{}个网页').replace('{}', `${bubble.search_online_result?.size || 0}`)}
              <SvgIcon name="ArrowRight" size={10} />
            </Button>
          </>
        )),
      };
    }
    else if (bubble.role === MessageType.recommendedQuestion) { // 问题推荐
      return {
        placement: 'start',
        avatar: showAvatar(index),
        typing: { step: 5, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
          },
        },
        messageRender: () => (
          <RecommendedQuestion
            questions={bubble.questions}
            onClick={onSubmit}
          />
        ),
      };
    }
    else if (bubble.role === MessageType.documentLink) { // 文档链接
      return {
        placement: 'start',
        avatar: showAvatar(index),
        typing: { step: 5, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
          },
        },
        messageRender: () => (<DocumentLink docs={bubble.docs} />),
      };
    }
    else if (bubble.role === MessageType.toolCalling) { // 工具调用
      return {
        placement: 'start',
        avatar: showAvatar(index),
        typing: { step: 5, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
          },
        },
        messageRender: () => (<ToolChain toolChain={bubble.tools} version={Math.random()} />),
      };
    }
    else if (bubble.role === MessageType.end) { // 结束
      return {
        placement: 'start',
        avatar: <img style={{ width: '32px', height: '32px', visibility: 'hidden' }} />,
        typing: { step: 5, interval: 20 },
        variant: 'borderless',
        styles: {
          content: {
            borderRadius: 8,
          },
        },
        messageRender: () => (
          <>
            {canLike && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<SvgIcon name={bubble?.liked === FeedbackType.like ? 'LikesSelected' : 'Likes'} size={16} />}
                  onClick={async () => {
                    try {
                      if (parsedMessages[index].message.liked === FeedbackType.like) {
                        parsedMessages[index].message.liked = null;
                        setMessages(parsedMessages);
                      }
                      else {
                        await handleFeedback({ index, type: FeedbackType.like });
                      }
                    }
                    catch (error: any) {
                      error.message && message.error(error.message);
                    }
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<SvgIcon name={bubble?.liked === FeedbackType.dislike ? 'DislikedSelected' : 'Disliked'} size={16} />}
                  onClick={() => {
                    handleLike(FeedbackType.dislike, bubble.key, index);
                  }}
                />
              </>
            )}
          </>
        ),
      };
    }
    else {
      const userAvatar = conversationInfo?.user_avatar || userData.avatar;
      return {
        placement: 'end',
        avatar: userAvatar ? <img src={userAvatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} /> : <SvgIcon name="DefaultAvatar" size={40} />,
        variant: 'filled',
        styles: {
          content: {
            backgroundColor: '#2871FF',
            color: '#ffffff',
            borderRadius: 8,
            marginLeft: 'auto',
            padding: '8px 12px',
            minHeight: 'auto',
          },
        },
        header: (
          <Flex gap="middle">
            {bubble.input_files?.map(file => (

              <Attachments.FileCard
                key={file.uid}
                item={file}
                imageProps={{
                  width: 68,
                  height: 68,
                }}
              />
            ))}
          </Flex>
        ),
      };
    }
  };

  // 消息列表
  const msgItems: GetProp<typeof Bubble.List, 'items'> & MessageInfoType[] = parsedMessages.map(({ id, status, message }) => {
    let load = status === 'loading' && (!message?.content || message.content.length < 5);
    let role = status === 'local' ? 'local' : 'ai';
    let key = status === 'local' ? id : Math.random().toString();
    if (message.message_type
      && [
        MessageType.recommendedQuestion,
        MessageType.documentLink,
        MessageType.searchOnline,
        MessageType.toolCalling,
        MessageType.toolResult,
        MessageType.end,
      ].includes(message.message_type)) {
      role = message.message_type;
      load = false;
      key = id;
    }
    return {
      key,
      loading: load,
      role,
      ...(message),
      content: status === 'local' ? message?.input : message?.content,
    };
  });

  return {
    conversationInfo,
    setConversationInfo,
    agent,
    onRequest,
    parsedMessages,
    messages,
    setMessages,
    getConversation,
    roles,
    online,
    setOnline,
    feedbackRef,
    handleFeedback,
    msgItems,
    content,
    setContent,
    chatLoading,
    setChatLoading,
    onSubmit,
    onCancel,
    drawerOpen,
    setDrawerOpen,
    searchResult,
    setSearchResult,
    controller,
    fileItems,
    setFileItems,
    openAttachment,
    setOpenAttachment,
  };
};
