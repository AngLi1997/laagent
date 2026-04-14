import { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Menu, Text, Divider } from 'react-native-paper';
import RenameIcon from '@/assets/icons/rename.svg';
import DeleteIcon from '@/assets/icons/delete.svg';
import { t } from '@bmos/i18n';
import { useAgentStore } from '@/store';
import { useNavigation } from '@react-navigation/native';

const AgentItem = ({ item, onRename, onDelete, onClose }: any) => {
  const navigation = useNavigation();
  const { setAgent } = useAgentStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchorPosition={'bottom'}
      contentStyle={{
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingVertical: 0,
        left: 40
      }}
      // @ts-ignore
      anchor={
        // @ts-ignore
        <TouchableOpacity
          style={styles.itemContainer}
          onLongPress={openMenu}
          onPress={() => {
            setAgent({ conversationId: item.conversation_id });
            navigation.reset({
              index: 0,
              routes: [{ name: 'Chat' } as never]
            })
          }}
          activeOpacity={0.7}
        >
          {/* @ts-ignore */}
          <Image
            source={{ uri: item.agent_avatar }}
            style={styles.historyAvatar}
          />
          {/* @ts-ignore */}
          <Text numberOfLines={1} style={styles.itemText}>{item.conversation_title}</Text>
        </TouchableOpacity>
      }
    >
      {/* @ts-ignore */}
      <Menu.Item
        leadingIcon={() => <RenameIcon width={18} height={18} color='#6C7380' />}
        onPress={() => { closeMenu(); onRename(item); }}
        title={t('重命名')}
        containerStyle={{
          alignItems: 'center'
        }}
        titleStyle={{
          color: '#6C7380'
        }}
      />
      <Divider />
      <Menu.Item
        leadingIcon={() => <DeleteIcon width={18} height={18} color='#FF5633' />}
        onPress={() => { closeMenu(); onDelete(item); }}
        title={t('删除')}
        containerStyle={{
          alignItems: 'center',
        }}
        titleStyle={{
          color: '#FF5633'
        }}
      />
    </Menu>
  );
};

export default AgentItem

const styles = StyleSheet.create({
  historyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    fontSize: 16,
    color: '#000',
  },
});
