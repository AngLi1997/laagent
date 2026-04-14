import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import MarkdownRenderer from '../MarkdownRenderer'; // 替换为实际的 Markdown 渲染组件路径
import { Icon } from '@ant-design/react-native'
import { ToolCallingMessage } from '@/types'; 


export interface ToolChainProps {
  toolChain: Map<string, ToolCallingMessage> | undefined;
  version?: number;
}

export interface ThoughtChainItem {
  title: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  content?: React.ReactNode;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'success':
      return <Icon name="check-circle" size={20} color="green" />;
    case 'error':
      return <Icon name="close-circle" size={20} color="red" />;
    case 'pending':
      return <ActivityIndicator />;
    default:
      return null;
  }
}

const ToolChain: React.FC<ToolChainProps> = memo(({ toolChain, version }) => {
  const [mockServerResponseData, setMockServerResponseData] = useState<ThoughtChainItem[]>([]);

  const newItems = useMemo(() => {
    if (!toolChain) return [];
    return Array.from(toolChain.entries()).map(([_key, value]) => ({
      title: value.tool_name,
      description: `${JSON.stringify(value.tool_param, null, 2)}`,
      status: value.status,
      icon: getStatusIcon(value.status),
      content: value.result && (
        <MarkdownRenderer
          content={`\`\`\`json\n${JSON.stringify(value.result, null, 2)}\n\`\`\``}
        />
      ),
    }));
  }, [toolChain, version]);

  useEffect(() => {
    setMockServerResponseData(newItems);
  }, [newItems]);

  return (
    <ScrollView style={styles.container}>
      {mockServerResponseData.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.header}>
            {item.icon}
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.content}>
            {item.content}
          </View>
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  content: {
    marginTop: 8,
  },
});

export default ToolChain;