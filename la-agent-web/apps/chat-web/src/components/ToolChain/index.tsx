import type { ThoughtChainItem } from '@ant-design/x';
import type { ToolCallingMessage } from '../ChatCom/type';
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ThoughtChain } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Markdown from '../MarkdownRenderer';

const useStyle = createStyles(({ css }) => ({
  markdown: css`
    width: 80vw;
    max-width: 680px;
    max-height: 400px;
    overflow-y: auto;
  `,
}));

export interface ToolChainProps {
  toolChain: Map<string, ToolCallingMessage> | undefined;
  version?: number;
}

function getStatusIcon(status: ThoughtChainItem['status']) {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'error':
      return <InfoCircleOutlined />;
    case 'pending':
      return <LoadingOutlined />;
    default:
      return undefined;
  }
}

const ToolChain: React.FC<ToolChainProps> = memo(({ toolChain, version }) => {
  const { styles } = useStyle();
  const [mockServerResponseData, setMockServerResponseData] = useState<ThoughtChainItem[]>([]);
  const newItems = useMemo(() => {
    if (!toolChain)
      return [];
    return Array.from(toolChain.entries()).map(([_key, value]) => {
      return {
        title: value.tool_name,
        description: `${JSON.stringify(value.tool_param, null, 2)}`,
        status: value.status,
        icon: getStatusIcon(value.status),
        content: (value.result?.code === 0 && <Markdown className={styles.markdown} content={`\`\`\` ${JSON.parse(value.result.data)?.viewType === 'text' ? 'json' : 'chart'}\n${JSON.stringify(JSON.parse(value.result.data), null, 2)}\n\`\`\``} />),
      };
    });
  }, [toolChain, version]);
  useEffect(() => {
    setMockServerResponseData(newItems);
  }, [newItems]);

  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      <ThoughtChain items={mockServerResponseData} />
    </div>
  );
});

export default ToolChain;
