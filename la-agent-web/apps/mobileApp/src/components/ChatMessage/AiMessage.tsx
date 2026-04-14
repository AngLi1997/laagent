import React, { memo, useState } from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import RecommendedQuestion from '../RecommendedQuestion';
import DocumentLink from '../DocumentLink';
import OnlineSearch from '../OnlineSearch';
import { MessageInfoType, MessageType } from '@/types';
import FeedbackButtons from '../FeedbackButtons';
import ToolChain from '../ToolChain';
import MessageMenu from './MessageMenu';
import { Text, TouchableOpacity, View } from 'react-native';

type AiMessageProps = {
  item: MessageInfoType,
  index: number,
  sendQuestion: (question: string) => void,
  onFeedback: (params: any) => void;
}

const AiMessage: React.FC<AiMessageProps> = memo(({ item, index, sendQuestion, onFeedback }) => {
  const RenderItem = ({ item, index }: { item: MessageInfoType, index: number }) => {
    const itemKey = index + (item.question_id || '') + (item.node_id || '');
    const [menuVisible, setMenuVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    switch (item.message_type) {
      case MessageType.recommendedQuestion:
        return (
          <RecommendedQuestion
            key={itemKey}
            questions={item.questions}
            onClick={(question: string) => {
              sendQuestion(question);
            }}
          />
        );
      case MessageType.searchOnline:
        return (
          <OnlineSearch
            key={itemKey}
            searchOnlineResult={item.search_online_result}
          />
        );
      case MessageType.documentLink:
        return (
          <DocumentLink
            key={itemKey}
            docs={item.docs}
          />
        );
      case MessageType.toolCalling:
        return (
          <ToolChain toolChain={item.tools} version={Math.random()} />
        );
      case MessageType.text:
        return (
          <View key={itemKey}>
            <TouchableOpacity
              onPressIn={(e) => {
                const { locationX, locationY, pageX, pageY } = e.nativeEvent;
                setPos({ x: pageX, y: pageY });
              }}
              onLongPress={() => {
                setMenuVisible(true);
              }}
              activeOpacity={0.7}
            >
              <MarkdownRenderer
              content={item.content || ''}
            />
            </TouchableOpacity>
            <MessageMenu 
              item={item} 
              menuVisible={menuVisible} 
              setMenuVisible={setMenuVisible} 
              x={pos.x} y={pos.y} 
            />
          </View>

          
        );
      case MessageType.end:
        return (
          <FeedbackButtons key={itemKey} bubble={item} index={index} handleFeedback={onFeedback} />
        )
      default:
        return <Text selectable>{item.content}</Text>;
    }
  };

  return <RenderItem index={index} item={item} />
});

export default AiMessage;