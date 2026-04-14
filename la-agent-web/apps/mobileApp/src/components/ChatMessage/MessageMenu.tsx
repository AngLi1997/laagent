import React, { useState } from 'react';
import { Menu, Divider } from 'react-native-paper';
import { t } from '@bmos/i18n';
import { Icon, Toast } from '@ant-design/react-native';
import { Modal, ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { copyText } from '@/utils';
import SelectTextModal from './SelectTextModal';

type Props = {
  item: any;
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  x: number;
  y: number;
};

const MessageMenu: React.FC<Props> = ({ item, menuVisible, setMenuVisible, x, y }) => {
  const [selectVisible, setSelectVisible] = useState(false);
  return (
    <>
      <SelectTextModal selectVisible={selectVisible} setSelectVisible={setSelectVisible} item={item} />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={{
          backgroundColor: '#fff',
          borderRadius: 6,
          paddingVertical: 0,
          left: 40
        }}
        // @ts-ignore
        anchor={{ x, y }}>
        {/* @ts-ignore */}
        <Menu.Item
          leadingIcon={() => <Icon name="copy" color="#6C7380" />}
          onPress={() => { copyText(item.content); setMenuVisible(false); Toast.show(t('复制成功')); }}
          title={t('复制')}
          containerStyle={{
            alignItems: 'center'
          }}
          titleStyle={{
            color: '#6C7380'
          }}
        />
        <Divider />
        <Menu.Item
          leadingIcon={() => <Icon name="code" color="#6C7380" />}
          onPress={() => { setSelectVisible(true); setMenuVisible(false); }}
          title={t('选择文本')}
          containerStyle={{
            alignItems: 'center',
          }}
          titleStyle={{
            color: '#6C7380'
          }}
        />
      </Menu>
    </>
  );
};

export default MessageMenu;
