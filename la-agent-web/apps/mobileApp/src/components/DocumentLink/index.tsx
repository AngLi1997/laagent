import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import DocIcon from '@/assets/icons/DocIcon.svg'; // 替换为实际的 SvgIcon 路径
import { useState } from 'react';
import { Flex } from '@ant-design/react-native';
import RightIcon from '@/assets/icons/right.svg'; // 替换为实际的图标路径
import { t } from '@bmos/i18n';
import { DocumentLinkMessage } from '@/types'

export interface DocumentLinkProps {
  docs: Map<string, DocumentLinkMessage[]> | undefined;
}

/**
 * 文档
 */
const DocumentLink: React.FC<DocumentLinkProps> = memo(({ docs }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentChunks, setCurrentChunks] = useState<DocumentLinkMessage[]>([]);
  const [currentDocName, setCurrentDocName] = useState('');

  const docList: { document_url: string; document_name: string; chunks: DocumentLinkMessage[] }[] = [];
  docs &&
    docs.forEach((value, keys: string) => {
      const key = keys.split('::');
      docList.push({
        document_url: key?.[0],
        document_name: key?.[1],
        chunks: value,
      });
    });

  const openModal = (docName: string, chunks: DocumentLinkMessage[]) => {
    console.log('chunks', chunks);
    console.log('docName', docName);
    setCurrentDocName(docName);
    setCurrentChunks(chunks);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentChunks([]);
    setCurrentDocName('');
  };

  return (
    <View style={styles.container}>
      {docList.map((doc) => (
        <TouchableOpacity
          key={doc.document_url}
          style={styles.documentItem}
          onPress={() => openModal(doc.document_name, doc.chunks)}
        >
          <Flex align="center" style={{ gap: 4 }}>
            <DocIcon  width={16} height={16} />
            <Text style={styles.documentName} numberOfLines={1}>{doc.document_name}</Text>
            <RightIcon width={12} height={12} />
          </Flex>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentDocName}</Text>
            <ScrollView style={styles.chunkList}>
              {currentChunks.map((chunk, index) => (
                <View key={chunk.document_chunk_content + index} style={styles.chunkItem}>
                  <Text selectable style={styles.chunkText}>{chunk.document_chunk_content}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
              <Text style={styles.cancelText}>{t('关闭')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
    marginBottom: 16,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    color: '#2871FF',
  },
  modalContainer: {
    minHeight: 600,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    minHeight: 600,
    maxHeight: 800,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  chunkList: {
    flex: 1,
  },
  chunkItem: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#F7F8FA',
  },
  chunkText: {
    fontSize: 14,
    color: '#606266',
  },
  cancelBtn: {
    height: 44,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  cancelText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DocumentLink;