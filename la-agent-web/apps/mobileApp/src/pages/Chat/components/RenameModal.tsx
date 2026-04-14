import { t } from '@bmos/i18n';
import React, { useEffect, useState } from 'react';
import { deleteConversation, updateConversationTitle } from '@/api'
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Toast } from '@ant-design/react-native';

const { width } = Dimensions.get('window');

interface RenameModalProps {
  visible: boolean;
  id: string;
  title: string
  onCancel: () => void;
  onOk: (name: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ visible, onCancel, onOk, id, title }) => {
  const [name, setName] = useState<string>('')

  const onConfirm = async () => {
    try {
      if (!name.length) {
        Toast.show(t('请输入对话名称'));
        return
      }
      await updateConversationTitle({
        conversation_title: name,
        conversation_id: id,
      });
      onCancel();
      onOk(name)
    }
    catch (error: any) {
      error.message && Toast.show(error.message);
    }
  }

  useEffect(() => {
    setName(title)
  }, [title])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('修改名称')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('请输入对话名称')}
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{t('取消')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Text style={styles.logoutText}>{t('确认')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 44, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F7F8FA',
  },
  cancelText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#2871FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F2F3F5',
    width: '100%',
    marginBottom: 20,
    padding: 12
  }
});

export default RenameModal;