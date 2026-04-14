import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Image,
} from 'react-native';
import dayjs from 'dayjs';
import { getItem } from '@/utils';
import AgentIcon from '@/assets/icons/sidebarAgent.svg';
import SearchIcon from '@/assets/icons/search.svg';
import RightIcon from '@/assets/icons/right.svg';
import { t } from '@bmos/i18n';
import { getConversationPage } from '@/api';
import { useNavigation } from '@react-navigation/native';
import DeleteHistoryModal from './DeleteHistoryModal'
import RenameModal from './RenameModal'
import AgentItem from './AgentItem'

interface SessionItem {
  conversation_id: string;
  conversation_title: string;
  agent_avatar: string;
  last_chat_time: string;
}

interface SectionData {
  title: string;
  data: SessionItem[];
}

function groupSessionsByDate(sessions: SessionItem[]): SectionData[] {
  const now = dayjs();
  const groups: { [key: string]: SessionItem[] } = {};

  sessions.forEach(item => {
    const d = dayjs(item.last_chat_time);
    let groupTitle = '';
    if (d.isSame(now, 'day')) {
      groupTitle = t('今天');
    } else if (d.isSame(now, 'month')) {
      groupTitle = t('本月');
    } else if (d.isSame(now, 'year')) {
      groupTitle = d.format('YYYY.M');
    } else if (d.isSame(now.subtract(1, 'year'), 'year')) {
      groupTitle = t('去年');
    } else {
      groupTitle = d.format('YYYY');
    }
    if (!groups[groupTitle]) groups[groupTitle] = [];
    groups[groupTitle].push(item);
  });

  // 保证分组顺序
  const order = [t('今天'), t('本月'), t('去年')];
  const rest = Object.keys(groups)
    .filter(k => !order.includes(k))
    .sort((a, b) => (b > a ? 1 : -1)); // 年月降序

  return [
    ...order.filter(k => groups[k]).map(k => ({ title: k, data: groups[k] })),
    ...rest.map(k => ({ title: k, data: groups[k] })),
  ];
}

const Sidebar: React.FC<{ onClose: Function, isOpen: boolean }> = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const [data, setData] = useState<SessionItem[]>([]);
  const [renameVisible, setRenameVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [userData, setUserData] = useState<any>({})
  const pageSize = 20;
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 搜索过滤+分组
  const groupedData = useMemo(() => groupSessionsByDate(data), [data]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const openRenameModal = (item: any) => {
    setSelectedItem(item)
    setRenameVisible(true);
  }

  // 完成重命名
  const handleRename = (renameValue: string) => {
    if (!selectedItem.conversation_id) return;
    setData(prev =>
      prev.map(item => {
        return item.conversation_id === selectedItem.conversation_id ? { ...item, conversation_title: renameValue } : item
      })
    );
    setRenameVisible(false);
  };

  const removeDeleteItem = () => {
    if (!selectedItem.conversation_id) return;
    setData(prev =>
      prev.filter(item => {
        return item.conversation_id !== selectedItem.conversation_id
      })
    );
  }

  const handleDelete = (item: any) => {
    setSelectedItem(item)
    setDeleteVisible(true)
  }

  // 分页加载历史会话
  const getHistoryList = async (nextPageNum = pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getConversationPage({
        page_num: nextPageNum,
        page_size: pageSize,
        conversation_title: ''
      });
      const list = res.data?.data || [];
      setData(prev => nextPageNum === 1 ? list : [...prev, ...list]);
      setHasMore(list.length === pageSize);
      setPageNum(nextPageNum + 1);
    } catch (e) {
      // 错误处理
    }
    setLoading(false);
  };

  const [refreshing, setRefreshing] = useState(false);
  // 下拉刷新逻辑
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setPageNum(1); // 重置分页
      setHasMore(true);
      const res = await getConversationPage({
        page_num: 1,
        page_size: pageSize,
        conversation_title: '',
      });
      const list = res.data?.data || [];
      setData(list); // 更新数据
    } catch (e) {
      console.error(e); // 错误处理
    }
    setRefreshing(false);
  };

  const init = () => {
    try {
      setUserData(JSON.parse((getItem('BMOS_SSO_USER') || '{}') as string))
      handleRefresh()
    }
    catch (error) {
      console.log(error);
    }
  }

  // 初始化加载
  useEffect(() => {
    init()
  }, [isOpen]);

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ height: 64, }} onPress={() => navigation.navigate('Set' as never)}>
          <View style={styles.cardContainer}>
            <View style={styles.cardLeft}>
              <Image
                source={userData.avatar ? { uri: userData.avatar } : require('@/assets/avatar.png')}
                style={styles.avatar}
                resizeMode="cover"
              />
              <Text style={styles.username}>{userData.userName}</Text>
            </View>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 48, }} onPress={() => navigation.navigate('Agent' as never)}>
          <View style={styles.agentContainer}>
            <View style={styles.agentLeft}>
              <AgentIcon width={16} height={16} color='#2B2F33' />
              <Text style={styles.agentName}>{t('智能体')}</Text>
            </View>
            <RightIcon color="#B6B9BF" width={12} height={12} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>{t('历史对话')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchHistory' as never)}>
          <View style={styles.searchLeft}>
            <SearchIcon width={16} height={16} color='#6C7380' />
            <Text style={styles.searchText}>{t('搜索')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <SectionList
        style={styles.listContainer}
        sections={groupedData}
        keyExtractor={item => item.conversation_id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <AgentItem
            item={item}
            onClose={onClose}
            onRename={(item: any) => openRenameModal(item)}
            onDelete={(item: any) => handleDelete(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={() => {
          if (!loading && hasMore) getHistoryList();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? <Text style={{ color: '#c1c4cb', textAlign: 'center', padding: 10 }}>{t('加载中')}...</Text>
            : !hasMore ? <Text style={{ color: '#c1c4cb', textAlign: 'center', padding: 10 }}>{t('没有更多了')}</Text>
              : null
        }
        refreshing={refreshing} // 绑定刷新状态
        onRefresh={handleRefresh} // 绑定刷新逻辑
      />
      {/* Logout Modal */}
      <DeleteHistoryModal
        visible={deleteVisible}
        id={selectedItem.conversation_id}
        onCancel={() => setDeleteVisible(false)} // 关闭弹窗
        onOk={() => removeDeleteItem()}
      />
      {/* rename Modal */}
      <RenameModal
        visible={renameVisible}
        id={selectedItem.conversation_id}
        title={selectedItem.conversation_title}
        onCancel={() => setRenameVisible(false)} // 关闭弹窗
        onOk={(name: string) => handleRename(name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 16
  },
  cardContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E3E5'
  },
  cardLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  username: {
    fontSize: 14,
    color: '#242526'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // 圆形头像
  },
  agentContainer: {
    paddingTop: 14,
    paddingBottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  agentLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 16,
    color: '#242526'
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchTitle: {
    color: '#242526',
  },
  searchLeft: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  searchText: {
    color: '#909398'
  },
  listContainer: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12
  },
  historyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sectionHeader: {
    fontWeight: '400',
    fontSize: 14,
    color: '#909398',
    marginBottom: 4,
    marginLeft: 4,
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
});

export default Sidebar;
