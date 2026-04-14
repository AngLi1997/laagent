import ChatCom from '@/components/ChatCom';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Independent: React.FC = () => {
  // ==================== Render =================

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 智能体id
  const agentId = searchParams.get('agentId') ?? undefined;
  // 对话id
  const conversationId = searchParams.get('id') ?? undefined;

  return (
    <ChatCom key={searchParams.get('t')} agentId={agentId} conversationId={conversationId} />
  );
};

export default Independent;
