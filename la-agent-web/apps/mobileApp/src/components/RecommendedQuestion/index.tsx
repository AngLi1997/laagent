import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flex } from '@ant-design/react-native';
import RightIcon from '@/assets/icons/right.svg';

export interface RecommendedQuestionProps {
  questions: string[] | undefined;
  onClick: (question: string) => void;
}

/**
 * 展示推荐问题，点击后回调
 */
const RecommendedQuestion: React.FC<RecommendedQuestionProps> = ({ questions, onClick }) => {
  return (
    // @ts-ignore
    <Flex direction="column" style={styles.container}>
      {/* @ts-ignore */}
      {questions &&
        questions.map((question) => (
          <TouchableOpacity
            key={question}
            style={styles.questionItem}
            onPress={() => onClick(question)}
          >
            <Text style={styles.questionText}>{question}</Text>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </TouchableOpacity>
        ))}
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginEnd: 20,
  },
});

export default RecommendedQuestion;