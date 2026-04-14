import type { MessageInfo } from '@ant-design/x/es/use-x-chat';
import type { SetStateAction } from 'react';
import type {
  DocumentLinkMessage,
  MessageInfoType,
  SearchOnlineMessage,
  ToolCallingMessage,
} from '../type';
import { MessageType, ToolResultEnum } from '../type';

export const handleMessage = (
  reqMsg: MessageInfoType,
  {
    messageList,
    messageMapRef,
  }: {
    messageList: MessageInfoType[];
    messageMapRef: Map<string, {
      docMap: Map<string, DocumentLinkMessage[]>;
      onlineResults: Map<string, SearchOnlineMessage>;
      tools: Map<string, ToolCallingMessage>;
    }>;
  },
): MessageInfoType[] => {
  const message_type = reqMsg.message_type === MessageType.toolResult ? MessageType.toolCalling : reqMsg.message_type;
  const messageKey = reqMsg.node_id ? `${message_type}:${reqMsg.node_id}` : message_type;
  const isNewMessage = !messageMapRef.has(messageKey);

  if (isNewMessage) {
    messageMapRef.set(messageKey, {
      docMap: new Map<string, DocumentLinkMessage[]>(),
      onlineResults: new Map<string, SearchOnlineMessage>(),
      tools: new Map<string, ToolCallingMessage>(),
    });
  }

  const { docMap, onlineResults, tools } = messageMapRef.get(messageKey)!;

  // 处理新消息
  if (isNewMessage) {
    switch (reqMsg.message_type) {
      case MessageType.error:
        return [reqMsg];
      case MessageType.text:
        messageList.push(reqMsg);
        break;
      case MessageType.searchOnline:
        onlineResults.set(reqMsg.url as string, reqMsg as SearchOnlineMessage);
        messageList.push({
          ...reqMsg,
          message_type: MessageType.searchOnline,
          search_online_result: onlineResults,
        });
        break;
      case MessageType.recommendedQuestion:
        messageList.push({
          ...reqMsg,
          message_type: MessageType.recommendedQuestion,
          questions: reqMsg.questions ?? [],
        });
        break;
      case MessageType.documentLink: {
        const key = `${reqMsg.document_url}::${reqMsg.document_name}`;
        if (!docMap.has(key)) {
          docMap.set(key, []);
        }
        docMap.get(key)!.push(reqMsg as DocumentLinkMessage);
        messageList.push({
          ...reqMsg,
          message_type: MessageType.documentLink,
          docs: docMap,
        });
        break;
      }
      case MessageType.toolCalling:
        tools.set(reqMsg.node_id as string, {
          tool_id: reqMsg.tool_id as string,
          tool_name: reqMsg.tool_name as string,
          tool_param: reqMsg.tool_param,
          status: ToolResultEnum.pending,
        } as ToolCallingMessage);
        messageList.push({
          ...reqMsg,
          message_type: MessageType.toolCalling,
          tools,
        });
        break;
      case MessageType.end:
        messageList.push(reqMsg);
        break;
    }
  }
  else {
    // 更新现有消息
    const existingMsg = messageList.find(
      item => item.message_type === message_type && (!reqMsg.node_id || item.node_id === reqMsg.node_id),
    );

    if (!existingMsg) {
      messageList.push(reqMsg);
    }
    else if (reqMsg.message_type === MessageType.text) {
      existingMsg.content = (existingMsg.content ?? '') + (reqMsg.content ?? '');
    }
    if (existingMsg) {
      switch (reqMsg.message_type) {
        case MessageType.error:
          return [reqMsg];
        case MessageType.searchOnline:
          onlineResults.set(reqMsg.url as string, reqMsg as SearchOnlineMessage);
          existingMsg.search_online_result = onlineResults;
          break;
        case MessageType.recommendedQuestion:
          existingMsg.questions = reqMsg.questions ?? [];
          break;
        case MessageType.documentLink: {
          const key = `${reqMsg.document_url}::${reqMsg.document_name}`;
          if (!docMap.has(key)) {
            docMap.set(key, []);
          }
          docMap.get(key)!.push(reqMsg as DocumentLinkMessage);
          existingMsg.docs = docMap;
          break;
        }
        case MessageType.toolCalling:
          tools.set(reqMsg.node_id as string, {
            tool_id: reqMsg.tool_id as string,
            tool_name: reqMsg.tool_name as string,
            tool_param: reqMsg.tool_param,
            status: ToolResultEnum.pending,
          } as ToolCallingMessage);
          existingMsg.tools = tools;
          break;
        case MessageType.toolResult:
          tools.set(reqMsg.node_id as string, {
            tool_id: reqMsg.tool_id as string,
            tool_name: reqMsg.tool_name as string,
            tool_param: reqMsg.tool_param,
            ...(reqMsg.error_msg
              ? {
                  result: reqMsg.error_msg,
                  status: ToolResultEnum.error,
                }
              : {
                  result: reqMsg.result,
                  status: ToolResultEnum.success,
                }),
          } as ToolCallingMessage);
          existingMsg.tools = tools;
          console.log(existingMsg);
          break;
        case MessageType.end:
          existingMsg.liked = null;
          break;
      }
    }
  }

  return messageList;
};

/**
 * 处理Agent消息
 * @param chats
 */
export const handleAgentMessage = (chats: any[]): SetStateAction<MessageInfo<MessageInfoType>[]> => {
  const msgInfoList = [] as any;

  for (const chat of chats) {
    msgInfoList.push({
      id: `${Math.random()}`,
      message: {
        conversation_id: chat?.conversation_id as string,
        agent_id: chat?.agent_id as string,
        input: chat.question,
      },
      status: 'local',
    });
    const messageMapRef = new Map<string, any>();
    let messageList = [] as any[];
    for (const message of chat.answer_messages_list) {
      messageList = handleMessage(
        {
          ...message,
          conversation_id: chat.conversation_id,
          question_id: chat.question_id,
          answer_id: chat.answer_id,
          input: chat.question,
          liked: chat.user_tag_type,
        },
        {
          messageList,
          messageMapRef,
        },
      );
    }
    msgInfoList.push({
      id: `${Math.random()}_old`,
      message: messageList,
      status: 'success',
    });
  }
  return msgInfoList;
};
