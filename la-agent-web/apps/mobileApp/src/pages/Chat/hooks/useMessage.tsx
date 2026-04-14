import { useEffect, useRef, useState } from "react";
import { MessageInfoType, MessageType } from "@/types";
import EventSource from "react-native-sse";
import Config from "react-native-config";
import { getItem, removeItem, resetToLogin } from '@/utils';
import { handleMessage } from "../utils";
import { Toast } from "@ant-design/react-native";
import { Keyboard } from "react-native";
import DocumentPicker from 'react-native-document-picker';

export const useMessage = (conversationInfo: any, setConversation: Function, setAgent: Function) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
// 是否联网
  const [isOnline, setIsOnline] = useState(false);
  const onlineRef = useRef('true');

  const es = useRef<EventSource | null>(null);

  useEffect(() => {
    onlineRef.current = isOnline ? 'true' : 'false';
  }, [isOnline]);

  const onSendMessage = async (message: MessageInfoType) => {
    Keyboard.dismiss();

    let messagesMemo = [...messages, {role: 'user', content: message.input}];
    setMessages((prevMessages) => [...prevMessages, {role: 'user', content: message.input}]);

    let count = 0;

    const messageMapRef = new Map<string, any>();
    let messageList: MessageInfoType[] = [];

    const formData = new FormData();
    formData.append('agent_id', message.agent_id as string);
    formData.append('input', message.input as string);
    if (message?.conversation_id) {
      formData.append('conversation_id', message?.conversation_id as string);
    }
    // formData.append('input_files', message?.input_files?.join(',') || '');
    formData.append('search_on_line', onlineRef.current);
    es.current = new EventSource(`${Config.VITE_API_HOST}api/app/agent/chat/sse/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        'BMOS-ACCESS-TOKEN': getItem('BMOS-ACCESS-TOKEN') || '',
      },
      body: formData,
      pollingInterval: 0,
    })
    es.current.addEventListener("open", (event: any) => {
      console.log("Connection opened", event);
      setLoading(true);
    });

    es.current.addEventListener("message", (event: any) => {
      count++;
      if (event.data !== "[DONE]") {
        const reqMsg = JSON.parse(event.data);
        if(!(conversationInfo.conversationId && conversationInfo.conversationId.length > 0) && reqMsg.conversation_id) {
          setConversation({
            conversationId: reqMsg.conversation_id,
            conversationName: message.input,
          });
          setAgent({conversationId: reqMsg.conversation_id})
        }
        // 跳过开始消息
        if (reqMsg.message_type === MessageType.start) {
          return;
        }
        if (reqMsg.message_type === MessageType.end) {
          setMessages([...messagesMemo]);
          setLoading(false);
        }
        messageList = handleMessage(reqMsg, {
          messageList,
          messageMapRef,
        });
        // setMessages((prev: any[]) => {
        //   const cur = prev.find((item) => item.question_id === reqMsg.question_id);
        //   if(cur) {
        //     cur.content = messageList;
        //     return prev;
        //   }else {
        //     return [...prev, {role: 'ai', ...reqMsg, content: [reqMsg]}];
        //   }
        // });
        const cur = messagesMemo.find((item) => item.question_id === reqMsg.question_id);
        if(cur) {
          cur.content = messageList;
        }else {
          messagesMemo = [...messagesMemo, {role: 'ai', ...reqMsg, content: [reqMsg]}];
        }
        if(count % 20 === 0) {
          setMessages([...messagesMemo]);
        }
      }else {
        console.log("Received end message");
        closeEventSource();
      }
    });

    es.current.addEventListener("error", (event: any) => {
      console.log("Error occurred:", event);
      const msg = JSON.parse(event.message)
      msg.message && Toast.show(msg.message);
      const { xhrStatus } = event;
      if (xhrStatus === 401 || xhrStatus === 403) {
        removeItem('BMOS-ACCESS-TOKEN');
        removeItem('BMOS_SSO_USER');
        // window.location.href = `/app/bmos-chat/main-chat?t=${Date.now()}`;
        resetToLogin()
      }
      closeEventSource();
    });

    es.current.addEventListener("close", (event: any) => {
      console.log("closed:", event);
      count = 0;
      setLoading(false);
    });
  }

  const closeEventSource = () => {
    console.log('es.current', es.current);
    es.current?.close();
  }

  const newConversation = () => {
    setMessages([]);
    setLoading(false);
    setIsOnline(false);
    setConversation({
      conversationId: '',
      conversationName: conversationInfo.agentName,
    });
    closeEventSource();
  }

// 选择文件
const pickDocument = async () => {
  const result = await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
    allowMultiSelection: true,
  });
  console.log(result);
};

  return {
    messages,
    loading,
    isOnline,
    onSendMessage,
    newConversation,
    setMessages,
    setLoading,
    setIsOnline,
    closeEventSource,
    pickDocument,
  }
}