import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Flex } from '@ant-design/react-native';
import WebIcon from '@/assets/icons/webIcon.svg'; // 替换为实际的图标路径
import BackIcon from '@/assets/icons/BackIcon.svg'; // 替换为实际的返回图标路径
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { t } from '@bmos/i18n';

const DocumentList = () => {
  const navigation = useNavigation();
  
  // query参数
  const { searchOnlineResult } = navigation.getState()?.routes[1].params || { searchOnlineResult: [] };
  const docList: { url: string; title: string; result: string; index: number }[] = [];
  searchOnlineResult?.forEach((item) => {
    docList.push({...item, index: docList.length + 1});
  });
  console.log('docList', docList);

  // 打开手机浏览器
  const openBrowser = (url: string) => {
    // 这里可以使用 Linking.openURL(url) 来打开手机浏览器
    console.log('打开手机浏览器:', url);
    Linking.openURL(url)
  };

  const renderItem = ({ item }: { item: typeof docList[0],}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openBrowser(item.url)}>
      <Flex align="center" style={{ gap: 8 }}>
        <WebIcon width={20} height={20} />
        <Text style={styles.sourceText}>{'BMOS网'}</Text>
        <Text style={styles.dateText}>{dayjs().format('YYYY/MM/DD')}</Text>
        <View style={styles.circle}><Text style={styles.circleText}>{item.index}</Text></View>
      </Flex>
      <Text style={styles.titleText} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.descriptionText} numberOfLines={3}>
        {item.result}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Flex align="center" style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#2B2F33" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('搜索结果')}</Text>
      </Flex>
      <FlatList
        data={docList}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
  },
  sourceText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#606266',
  },
  dateText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#C1C4CB',
  },
  titleText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242526',
  },
  descriptionText: {
    marginTop: 8,
    color: '#909398',
    fontFamily: "Source Han Sans CN",
    fontSize: 14
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8EAED',
    marginLeft: 'auto',
  },
  circleText: {
    lineHeight: 16,
    textAlign: 'center',
    padding: 0,
    color: '#606266',
    fontSize: 10,
  }
});

export default DocumentList;
