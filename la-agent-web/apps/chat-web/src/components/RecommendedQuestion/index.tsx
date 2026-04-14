import { RightOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { createStyles } from 'antd-style';

export interface RecommendedQuestionProps {
  questions: string[] | undefined;
  onClick: (question: string) => void;
}

const useStyle = createStyles(({ css }) => ({
  questionItem: css`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background: #F7F8FA;
    cursor: pointer;
    align-self: flex-start;
  `,
}));

/**
 * 展示推荐问题，点击后回调
 */
const RecommendedQuestion: React.FC<RecommendedQuestionProps> = ({ questions, onClick }) => {
  const { styles } = useStyle();
  return (
    <Flex vertical gap={12}>
      {questions && questions.map(question => (
        <div key={question} className={styles.questionItem} onClick={() => !window?.$wujie && onClick(question)}>
          <span style={{ fontSize: '14px' }}>{question}</span>
          <RightOutlined style={{ width: '12px', height: '12px' }} />
        </div>
      ))}
    </Flex>
  );
};

export default RecommendedQuestion;
