import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageInfoType } from '@/types';
import AiMessage from './AiMessage';

type UserMessage = {
  role: 'user';
  avatar?: string;
  content: string;
  onFeedback: (params: any) => void;
  sendQuestion: (question: string) => void;
};

type AiMessage = {
  role: 'ai';
  avatar?: string;
  content: MessageInfoType[];
  onFeedback: (params: any) => void;
  sendQuestion: (question: string) => void;
};

type MessageProps = UserMessage | AiMessage;

const ChatMessage: React.FC<MessageProps> = memo(({ role, avatar, content, onFeedback, sendQuestion }) => {
  const isUser = role === 'user';
  const isAI = role === 'ai';
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      {isAI && (
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )}
      {isUser ? (
        <View
          style={[
            styles.messageBubble, styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText, styles.userText,
            ]}
          >
            {content}
          </Text>
        </View>
      ) : (<View
        style={[styles.aiBubble]}
      >
        <TouchableOpacity style={{ gap: 8 }}>
          {content && content?.map((item, index: number) => {
            return (<AiMessage 
              key={index + (item.question_id || '') + (item.node_id || '')} 
              index={index} 
              item={item} 
              sendQuestion={sendQuestion} 
              onFeedback={onFeedback} 
            />)
          })}
        </TouchableOpacity>
      </View>)}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  aiContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  aiBubble: {
    padding: 0,
    flex: 1,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
});

export default ChatMessage;