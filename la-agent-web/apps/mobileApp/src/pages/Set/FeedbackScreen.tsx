import { t } from '@bmos/i18n';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import BackIcon from '@/assets/icons/BackIcon.svg';
import { createFeedback } from '@/api';
import { Toast } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import FeedbackList from './components/FeedbackList'

const { width } = Dimensions.get('window');

const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 状态
  const handleGoBack = () => {
    navigation.navigate('Set' as never)
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await createFeedback({ msg: feedback });
      Toast.show(t('反馈成功'));
      setFeedback('');
    }
    catch (error: any) {
      error.message && Toast.show(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <BackIcon color="#2B2F33" width={24} height={24} />
          </TouchableOpacity>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, tab === 'new' && styles.tabActive]}
              onPress={() => setTab('new')}
            >
              <Text style={[styles.tabText, tab === 'new' && styles.tabTextActive]}>{t('新增反馈')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'history' && styles.tabActive]}
              onPress={() => setTab('history')}
            >
              <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>{t('反馈历史')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {tab === 'new' ? (
          <View style={styles.content}>
            <Text style={styles.welcome}>{t('欢迎说出您的想法，BMOS 会努力做的更好！')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('请告诉我们你的想法')}
              placeholderTextColor="#BDBDBD"
              multiline
              value={feedback}
              onChangeText={setFeedback}
              textAlignVertical="top"
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: feedback.trim() ? '#1976D2' : '#B0C4DE' },
              ]}
              onPress={handleSubmit}
              disabled={!feedback.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading
                ? (
                  <ActivityIndicator color="#fff" />
                )
                : (
                  <Text style={styles.submitText}>{t('提交反馈')}</Text>
                )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <FeedbackList />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    height: 36,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 240,
    maxHeight: 180,
    padding: 16,
    fontSize: 15,
    color: '#222',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FeedbackScreen;