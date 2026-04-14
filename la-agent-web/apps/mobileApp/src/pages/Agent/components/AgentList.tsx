import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import StarIcon from '@/assets/icons/Star.svg';
import { useAgentStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { getAgents } from '@/api';

const FeedbackList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [agentList, setAgentList] = useState<any[]>([])
  const navigation = useNavigation();
  const { setAgent } = useAgentStore();
  const handleClickAgent = (item: any) => {
    setAgent({ ...item, conversationId: '' })
    navigation.navigate('Chat' as never)
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getAgentList()
    } catch (_) {
      //
    } finally {
      setRefreshing(false);
    }
  };

  const getAgentList = async () => {

    try {
      const { data } = await getAgents();
      setAgentList(data);
    } catch (e) {
      // 错误处理
    }
  };

  // 初始化加载
  useEffect(() => {
    try {
      getAgentList();
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleClickAgent(item)}>
      <View style={styles.listItem}>
        <View style={styles.listItemHeader}>
          {/* @ts-ignore */}
          <Image
            source={{ uri: item.icon_url }}
            style={styles.agentAvatar}
            resizeMode="cover"
          />
          <View style={styles.listItemMsg}>
            <Text style={styles.listItemTitle}>{item.name}</Text>
            <Text style={styles.listItemTime}>{item.description}</Text>
          </View>
          <StarIcon width={20} height={20} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={agentList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      removeClippedSubviews={false}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  listItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingEnd: 20,
    gap: 12,
    alignItems: 'center'
  },
  listItemMsg: {
    flexDirection: 'column',
    gap: 4,
    flex: 1
  },
  listItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  listItemTime: {
    fontSize: 14,
    color: '#909398',
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});

export default FeedbackList;