import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FeedbackHistoryIcon from '@/assets/icons/FeedbackHistory.svg';
import { t } from '@bmos/i18n';
import { getFeedbackHistory } from '@/api'

const FeedbackList = () => {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <FeedbackHistoryIcon width={20} height={20} />
        <View style={styles.listItemMsg}>
          <Text style={styles.listItemTitle}>{item.msg}</Text>
          <Text style={styles.listItemTime}>{item.feedback_time}</Text>
        </View>
      </View>
      {item.replies.map((reply: any) => (
        <View key={reply.id} style={styles.replyContainer}>
          <View style={styles.replyHeader}>
            <Text style={styles.replyUser}>{reply.reply_user}</Text>
            <Text style={styles.replyLabel}>{t('回复')}{'：'}</Text>
            <Text style={styles.replyTime}>{reply.reply_time}</Text>
          </View>
          <Text style={styles.replyContent}>{reply.reply_msg}</Text>
        </View>
      ))}
    </View>
  );

  const [refreshing, setRefreshing] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const getHistoryList = async () => {
    try {
      const { data } = await getFeedbackHistory();
      setHistoryList(data);
    } catch (e) {
      // 错误处理
    }
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getHistoryList()
    } catch (_error) {
      //
    } finally {
      setRefreshing(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    try {
      getHistoryList();
    }
    catch (error) {
      console.log(error);
    }
  }, []);


  return historyList.length ? <FlatList
    data={historyList}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
    contentContainerStyle={styles.listContainer}
    removeClippedSubviews={false}
    refreshing={refreshing}
    onRefresh={onRefresh}
  /> : <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>{t('暂无反馈历史')}</Text>
};

const styles = StyleSheet.create({
  listContainer: {
    // padding: 16,
  },
  listItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12
  },
  listItemMsg: {
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  },
  listItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flexWrap: 'wrap',
  },
  listItemTime: {
    fontSize: 14,
    color: '#909398',
  },
  replyContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  replyLabel: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 4,
  },
  replyTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 'auto',
  },
  replyContent: {
    fontSize: 14,
    color: '#333',
  },
});

export default FeedbackList;