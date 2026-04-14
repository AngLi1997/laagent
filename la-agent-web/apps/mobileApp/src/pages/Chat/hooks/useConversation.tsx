import { useState } from "react";
import { getConversationInfo } from "@/api";
import { handleAgentMessage } from "../utils";
import { Toast } from "@ant-design/react-native";

type ConversationInfoType = {
  agentId?: string;
  agentName?: string;
  agentAvatar?: string;
  conversationId?: string;
  conversationName?: string;
};

export const useConversation = () => {
  // agent的信息，包含agentId、agentName和agentAvatar
  const [conversationInfo, setConversationInfo] = useState<ConversationInfoType>({
    agentId: '',
    agentName: '',
    agentAvatar: '',
    conversationId: '',
    conversationName: '',
  });

  /**
   * 根据对话id获取对话信息
   * @param conversationId 对话id
   */
  const getConversation = async (conversationId: string) => {
    try {
      const { data } = await getConversationInfo({ id: conversationId });
      if (!data) {
        return [];
      }
      setConversation({
        agentId: data.agent_id,
        agentName: data.agent_name,
        agentAvatar: data.agent_avatar,
        conversationId: data.conversation_id,
        conversationName: data.conversation_title,
      })
      const msgList = handleAgentMessage(data.chats, data.conversation_id);
      return msgList;
    }
    catch (error: any) {
      error.message && Toast.show(error.message);
    }
  };

  // 设置agent信息
  const setConversation = (agent: ConversationInfoType) => {
    setConversationInfo((prev) => ({
      ...prev,
      ...agent,
    }));
  }
  // 清空agent信息
  const clearConversation = () => {
    setConversationInfo({
      agentId: '',
      agentName: '',
      agentAvatar: '',
      conversationId: '',
      conversationName: '',
    });
  }
  return {
    conversationInfo,
    setConversation,
    getConversation,
    clearConversation,
  }
}