import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Text, ScrollView } from 'react-native';
import { t } from '@bmos/i18n';
import { Icon } from '@ant-design/react-native';

type Props = {
  item: any;
  selectVisible: boolean;
  setSelectVisible: (visible: boolean) => void;
};

const SelectTextModal: React.FC<Props> = ({ item, selectVisible, setSelectVisible }) => {
  return <View>
  <Modal
    visible={selectVisible}
    transparent
    animationType="slide"
    onRequestClose={() => setSelectVisible(false)}
  >
    <View style={styles.fullScreenOverlay}>
      <View style={styles.fullScreenContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectVisible(false)}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {t('选择文本')}
          </Text>
          <View style={styles.placeholder} >
            <Text>{''}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollableContainer}>
          <Text style={styles.scrollableText} selectable>
            {item.content}
          </Text>
        </ScrollView>
      </View>
    </View>
  </Modal>
</View>
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 半透明遮罩
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollableContainer: {
    paddingBottom: 20,
  },
  scrollableText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
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
  placeholder: {
    width: 24, // 保持左右对称
  },
});

export default SelectTextModal;