import React, { memo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { t } from '@bmos/i18n';
import OnlineIcon from '@/assets/icons/online.svg';
import LinkIcon from '@/assets/icons/link.svg';
import SendBtn from '@/assets/icons/sendBtn.svg';
import MoreIcon from '@/assets/icons/more.svg';
import PlusPopIcon from '@/assets/icons/plusPop.svg';
// import { generateWatermark } from '@/utils';
import Sidebar from './components/Sidebar';
import { Drawer, Toast } from '@ant-design/react-native';
import { useConversation, useMessage } from './hooks';
import ChatMessage from '@/components/ChatMessage';
import { getAgents, getLastUseAgent } from '@/api';
import { MessageType } from '@/types';
import { useAgentStore } from '@/store';

const ChatScreen: React.FC = memo(() => {
  const isDarkMode = useColorScheme() === 'dark';

  const scrollRef = useRef<ScrollView>(null); // 创建 scroll 的 ref

  const { getAgent, setAgent } = useAgentStore();

  const {
    conversationInfo,
    setConversation,
    getConversation,
  } = useConversation();
  const {
    messages,
    loading,
    onSendMessage,
    setMessages,
    newConversation,
    closeEventSource,
    pickDocument,
  } = useMessage(conversationInfo, setConversation, setAgent);

  useEffect(() => {
    const init = async () => {
      const { id: agentId, conversationId } = getAgent()
      // helper: 设置 agent 和会话信息
      const applyAgentAndConversation = (
        agentInfo: any,
        conversationId?: string,
      ) => {
        setConversation({
          agentId: agentInfo.agentId,
          agentName: agentInfo.agentName,
          agentAvatar: agentInfo.agentAvatar,
          conversationName: agentInfo.conversationName,
          conversationId,
        });
        setAgent({
          id: agentInfo.agentId,
          name: agentInfo.agentName,
          icon_url: agentInfo.agentAvatar,
        })
      };

      try {
        // 如果有 conversationId，则获取对应的对话信息
        if (conversationId) {
          const msgList = await getConversation(conversationId);
          setMessages(msgList);
          return;
        }
        // 如果没有 conversationId，但有 agentId，则获取对应的 agent 信息
        if (agentId) {
          const res = await getAgents({ id: agentId });
          const data = res?.data?.[0];
          if (data) {
            applyAgentAndConversation({
              agentId: data.id,
              agentName: data.name,
              agentAvatar: data.icon_url,
              conversationName: data.name,
            });
          }
          return;
        }
        // 如果没有 agentId 和 conversationId，则获取最近使用的 agent 信息
        const lastUseRes = await getLastUseAgent();
        const lastData = lastUseRes?.data;

        if (lastData) {
          applyAgentAndConversation({
            agentId: lastData.agent_id,
            agentName: lastData.agent_name,
            agentAvatar: lastData.agent_avatar,
            conversationName: lastData.agent_name,
          });
        }
        else {
          // 如果没有最近使用的 agent，则获取默认的 agent 信息
          const res = await getAgents();
          const data = res?.data?.[0];
          if (data) {
            applyAgentAndConversation({
              agentId: data.id,
              agentName: data.name,
              agentAvatar: data.icon_url,
              conversationName: data.name,
            });
          }
        }
      }
      catch (err: any) {
        err?.message && Toast.show(err.message);
      }
    };
    if (!loading) {
      init();
    }
  }, [getAgent().conversationId, getAgent().id]);

  const send = () => {
    if (!loading && inputValue.length > 0) {
      onSendMessage({
        message_type: MessageType.user,
        input: inputValue,
        conversation_id: conversationInfo.conversationId,
        agent_id: conversationInfo.agentId,
      });
      setInputValue('');
    } else {
      closeEventSource();
    }
  }

  // 当消息列表更新时，自动滚动到底部
  useEffect(() => {
    if (loading && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#ffffff' : '#ffffff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    headerTitle: {
      maxWidth: '50%',
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#000000' : '#000000',
    },
    headerIcon: {
      padding: 8,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    robotIcon: {
      width: 60,
      height: 60,
      tintColor: isDarkMode ? '#000000' : '#000000',
    },
    loginLogo: {
      width: 60,
      height: 60,
    },
    welcomeText: {
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'center',
      color: isDarkMode ? '#000000' : '#000000',
      marginTop: 20,
    },
    bottomIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    input: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 18,
      color: isDarkMode ? '#000000' : '#000000',
      backgroundColor: isDarkMode ? '#f5f5f5' : '#f5f5f5',
    },
    iconButton: {
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center', // 垂直居中对齐
      justifyContent: 'center', // 水平居中（或根据需要调整）
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    linkButton: {
      marginLeft: 'auto',
      padding: 8,
      marginHorizontal: 4,
    },
    iconText: {
      fontSize: 14,
      lineHeight: 20,
      flexShrink: 0, // 防止文字被压缩
    },
    sendIconText: {
      fontSize: 20,
      color: '#ffffff',
    },
    online: {
      backgroundColor: '#EBF1FF',
      color: '#2871FF',
    },
    offline: {
      backgroundColor: '#F4F4F4',
      color: '#242526',
    },
  });

  const drawerRef = useRef<any>(null);
  const [inputValue, setInputValue] = React.useState('');
  // 是否联网
  const [isOnline, setIsOnline] = React.useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <Drawer
      /* @ts-ignore */
      sidebar={<Sidebar isOpen={isDrawerOpen} onClose={() => {
        drawerRef.current?.closeDrawer()
        setIsDrawerOpen(false)
      }} />}
      position="left"
      drawerRef={(el: any) => {
        drawerRef.current = el;
      }}
      drawerBackgroundColor="#F5F5F5"
      onOpenChange={(isOpen: boolean) => setIsDrawerOpen(isOpen)}
    >
      {/* @ts-ignore */}
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => drawerRef.current?.openDrawer()}>
            <MoreIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{conversationInfo.conversationName}</Text>
          <TouchableOpacity style={styles.headerIcon} onPress={() => newConversation()}>
            <PlusPopIcon />
          </TouchableOpacity>
        </View>

        <ImageBackground
          source={require('@/assets/watermark.png')} // 或使用 require('./path/to/image.jpg')
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {(!messages || messages.length === 0) ?
            <View style={styles.content}>
              <View style={styles.robotIcon}>
                {/* Replace with actual robot icon */}
                <Image
                  source={require('@/assets/LoginLogo.png')}
                  style={styles.loginLogo}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.welcomeText}>
                {t('你好，你可以随时向我提问！')}
              </Text>
            </View> :
            (<ScrollView ref={scrollRef} style={{ flex: 1, paddingHorizontal: 16, marginVertical: 16 }}>
              {messages.map((message, idx) => (
                <ChatMessage
                  key={idx}
                  role={message.role}
                  avatar={conversationInfo.agentAvatar}
                  content={message.content}
                  onFeedback={({ index, type }) => {
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      const cur = newMessages[idx].content[index];
                      if (cur.message_type === MessageType.end) {
                        cur.liked = type;
                      }
                      return newMessages;
                    })
                  }}
                  sendQuestion={(question: string) => {
                    !loading && onSendMessage({
                      message_type: MessageType.user,
                      input: question,
                      conversation_id: conversationInfo.conversationId,
                      agent_id: conversationInfo.agentId,
                    });
                  }}
                />
              ))}
            </ScrollView>)}
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('有问题尽管问我...')}
            value={inputValue}
            placeholderTextColor={isDarkMode ? '#666666' : '#666666'}
            onChangeText={setInputValue}
          />
        </View>
        <View style={styles.bottomIconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsOnline(prev => !prev)}>
            <View style={[styles.iconContainer, isOnline ? styles.online : styles.offline]}>
              <OnlineIcon width={16} height={16} color={isOnline ? '#2871FF' : '#2B2F33'} />
              <Text style={[styles.iconText, isOnline ? styles.online : styles.offline]}>{t('联网搜索')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => pickDocument()}>
            <LinkIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#2871FF', width: 30, height: 30, borderRadius: '50%'}} onPress={() => send()}>
            {
              loading ?
                <ActivityIndicator size={30} color="#fff" /> :
                <SendBtn width={30} height={30} color={inputValue.length > 0 ? '#2871FF' : '#A6C6FF'} />
            }
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Drawer>
  );
});

export default ChatScreen; 