import { t } from '@bmos/i18n';
import React from 'react';
import { deleteConversation } from '@/api'
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Toast } from '@ant-design/react-native';

const { width } = Dimensions.get('window');

interface DeleteHistoryModalProps {
  visible: boolean;
  id: string;
  onCancel: () => void;
  onOk: () => void;
}

const DeleteHistoryModal: React.FC<DeleteHistoryModalProps> = ({ visible, onCancel, onOk, id }) => {

  const onDelete = async () => {
    try {
      await deleteConversation({ id });
      onOk()
      onCancel();
    }
    catch (error: any) {
      error.message && Toast.show(error.message);
    }
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('删除对话')}</Text>
          <Text style={styles.subtitle}>
            {t('删除后，聊天记录将不可恢复')}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{t('取消')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={onDelete}>
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
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeleteHistoryModal;