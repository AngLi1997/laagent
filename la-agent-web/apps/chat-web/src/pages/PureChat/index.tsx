import ChatCom from '@/components/ChatCom';
import { ConversationType } from '@/components/ChatCom/type';
import { useRouteStore } from '@/stores/routeStore';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

// 对话(作为子应用嵌入到主应用中)
const PureChat: React.FC = () => {
  // ==================== Render =================

  const location = useLocation();
  const params = useParams();

  const setCurrentRoute = useRouteStore(state => state.setCurrentRoute);

  useEffect(() => {
    setCurrentRoute(location, params);
  }, []);

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);

  const props = window?.$wujie?.props;
  // 智能体id
  const agentId = props?.agentId ?? undefined;
  // 模式id
  const modelId = props?.modelId ?? undefined;
  // 对话id
  const conversationId = props?.id ?? undefined;
  // 对话类型
  const type = props?.type ?? ConversationType.conversation;
  // 是否能够点赞
  const canLike = props?.canLike ?? true;
  return (
    <ChatCom agentId={agentId} modelId={modelId} conversationId={conversationId} type={type} canLike={canLike} />
  );
};

export default PureChat;
