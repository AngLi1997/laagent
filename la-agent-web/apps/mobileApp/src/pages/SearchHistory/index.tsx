import { getConversationPage } from '@/api';
// @ts-ignore
import BackIcon from '@/assets/icons/BackIcon.svg';
// @ts-ignore
import SearchIcon from '@/assets/icons/search.svg';
// @ts-ignore
import SearchEmptyIcon from '@/assets/icons/SearchEmpty.svg';
import { useAgentStore } from '@/store';
import { debounce } from '@/utils';
import { t } from '@bmos/i18n';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SearchHeader = ({ searchText, onChangeText, onBack }: any) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
      <BackIcon width={24} height={24} />
    </TouchableOpacity>
    <View style={styles.searchBox}>
      <SearchIcon width={18} height={18} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={t('搜索对话标题')}
        placeholderTextColor="#B0B0B0"
        value={searchText}
        onChangeText={onChangeText}
        autoFocus
        clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : undefined}
        returnKeyType="search"
      />
    </View>
  </View>
);

const SearchResultItem = ({ item, onPress, searchText }: any) => {
  // 高亮匹配的文字
  const highlightText = (text: string, highlight: string) => {
    if (!highlight)
      return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part)
        ? (
            <Text key={index} style={styles.highlightText}>
              {part}
            </Text>
          )
        : (
            part
          ),
    );
  };
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: item.agent_avatar }}
        style={styles.iconCircle}
      />
      <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
        {highlightText(item.conversation_title, searchText)}
      </Text>
      <Text style={styles.itemDate}>{item.last_chat_time}</Text>
    </TouchableOpacity>
  );
};

const EmptyComponent = ({ searchText }: any) => (
  <View style={styles.emptyContainer}>
    {searchText
      ? (
          <>
            <SearchEmptyIcon width={70} height={70} />
            <Text style={styles.emptyText}>{t('暂无相关内容')}</Text>
          </>
        )
      : null}
  </View>
);

const SearchHistory = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { setAgent } = useAgentStore();

  const searchFun = debounce(async (text: string) => {
    if (!text) {
      setSearchResults([]);
      return;
    }
    const res = await getConversationPage({
      page_num: 1,
      page_size: 50,
      conversation_title: text,
    });
    const list = res.data?.data || [];
    setSearchResults(list);
  });

  // 搜索逻辑
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    searchFun(text);
  }, []);

  // 返回上一页
  const handleBack = () => {
    navigation.goBack();
  };

  // 跳转详情
  const handleItemPress = (item: any) => {
    setAgent({ conversationId: item.conversation_id });
    navigation.navigate('Chat' as never);
  };

  return (
    <View style={styles.container}>
      <SearchHeader
        searchText={searchText}
        onChangeText={handleSearch}
        onBack={handleBack}
      />
      <View style={styles.divider} />
      <FlatList
        data={searchResults}
        keyExtractor={item => item.conversation_id}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <>
            <SearchResultItem item={item} onPress={() => handleItemPress(item)} searchText={searchText} />
            <View style={styles.itemDivider} />
          </>
        )}
        ListEmptyComponent={<EmptyComponent searchText={searchText} />}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 18,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  itemDate: {
    fontSize: 13,
    color: '#B0B0B0',
    marginLeft: 10,
    minWidth: 70,
    textAlign: 'right',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 15,
    marginTop: 8,
  },
  highlightText: {
    color: '#2871FF',
    fontWeight: 'bold',
  },
});
