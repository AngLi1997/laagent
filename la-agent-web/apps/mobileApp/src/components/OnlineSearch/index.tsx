import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import OnlineSearchIcon from '@/assets/icons/onlineSearch.svg';
import RightIcon from '@/assets/icons/right.svg';
import { useNavigation } from '@react-navigation/native';
import { t } from '@bmos/i18n';

type SearchOnlineProps = {
  searchOnlineResult: any;
}

const OnlineSearch: React.FC<SearchOnlineProps> = ({ searchOnlineResult }) => {
  console.log('searchOnlineResult', searchOnlineResult);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        console.log('点击了搜索结果');
        navigation.navigate('DocumentList', { searchOnlineResult });
        // setDrawerOpen(true);
        // const resList: SearchOnlineMessage[] = [];
        // bubble.search_online_result?.forEach((item) => {
        //   resList.push(item);
        // });
        // setSearchResult(resList);
      }}
    >
      <OnlineSearchIcon color="#B6B9BF" width={16} height={16} />
      <Text style={styles.text}>{t('已搜索{}个网页').replace('{}', `${searchOnlineResult?.size || 0}`)}</Text>
      <RightIcon color="#B6B9BF" width={12} height={12} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
    gap: 8,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default OnlineSearch;