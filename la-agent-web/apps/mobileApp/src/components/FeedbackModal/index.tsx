import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { t } from '@bmos/i18n';
import { FeedbackType } from '@/types';
import { userTag } from '@/api';
import { Toast } from '@ant-design/react-native';

// 获取屏幕宽度以动态调整弹窗大小
const { width } = Dimensions.get('window');

const FeedbackModal: React.FC<{ data: any, modalVisible: boolean, onSubmit: () => void, closeModal: () => void }> = ({ data, modalVisible, onSubmit, closeModal }) => {
  // 存储输入框内容
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const options = [
    t('没有理解问题'),
    t('没有完成任务'),
    t('编造事实'),
  ];

  const submit = async () => {
    try {
      // 提交反馈逻辑
      const params = {
        question_id: data.question_id,
        answer_id: data.answer_id,
        conversation_id: data?.conversation_id,
        tag_type: FeedbackType.dislike,
        content_type: selectedTags,
        content: feedback,
      };
      await userTag(params);
      console.log('提交反馈:', feedback);
      onSubmit(); // 提交
    } catch (error) {
      error.message && Toast.fail(error.message);
    }
    
  }

  return (
    <View style={styles.container}>
      {/* 弹窗 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeModal()} // Android 物理返回键
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 标题和关闭按钮 */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('抱歉，BMOS让您有不好的感受')}
              </Text>
              <TouchableOpacity onPress={() => closeModal()}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 描述 */}
            <Text style={styles.description}>
              {t('请选择帮助我们改善的更好')}
            </Text>

            {/* 选项按钮 */}
            <View style={styles.optionsContainer}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() =>
                    selectedTags.includes(option)
                      ? setSelectedTags(selectedTags.filter(item => item !== option))
                      : setSelectedTags([...selectedTags, option])
                  }
                  style={[
                    styles.unOptionButton,
                    selectedTags.includes(option) && styles.optionButton,
                  ]}
                >
                  <Text style={[styles.unOptionText, selectedTags.includes(option) && styles.optionText]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 输入框 */}
            <TextInput
              style={styles.input}
              placeholder={t('请告诉我们你的想法...')}
              placeholderTextColor="#999"
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />

            {/* 提交按钮 */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => submit()}
            >
              <Text style={styles.submitButtonText}>{t('提交反馈')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  openButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContent: {
    width: width,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Android 阴影
    shadowColor: '#000', // iOS 阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  unOptionButton: {
    borderRadius: 4,
    backgroundColor: '#F0F1F2',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  unOptionText: {
    fontSize: 14,
    color: '#606266',
  },
  optionButton: {
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    height: 80,
    textAlignVertical: 'top', // 确保多行输入框从顶部开始
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#2871FF',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FeedbackModal;