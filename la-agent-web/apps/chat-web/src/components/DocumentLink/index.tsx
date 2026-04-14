import type { PromptsProps } from '@ant-design/x';
import type { DocumentLinkMessage } from '../ChatCom/type';
import { RightOutlined } from '@ant-design/icons';
import { Prompts } from '@ant-design/x';
import { Flex, Popover } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import SvgIcon from '../SvgIcon';

export interface DocumentLinkProps {
  docs: Map<string, DocumentLinkMessage[]> | undefined;
}

const useStyle = createStyles(({ css }) => ({
  popover: css`
    width: 80vw;
    max-width: 800px;
    .ant-popover-content .ant-popover-inner {
      width: 100%;
      max-height: 40vh;
      overflow-y: auto;
    }
  }`,
  documentItem: css`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 8px;
    background: #F7F8FA;
    color: #2871FF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    align-self: flex-start;
  `,
}));

// const downLoad = (doc: DocumentLinkMessage) => {
//   fetch(doc.document_url)
//   .then(response => response.blob())
//   .then(blob => {
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = doc.document_name;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   });
// }

/**
 * 文档
 */
const DocumentLink: React.FC<DocumentLinkProps> = memo(({ docs }) => {
  const docList: { document_url: string; document_name: string; chunks: DocumentLinkMessage[] }[] = [];
  docs && docs.forEach((value, keys: string) => {
    const key = keys.split('::');
    docList.push({
      document_url: key?.[0],
      document_name: key?.[1],
      chunks: value,
    });
  });
  const { styles } = useStyle();
  return (
    <Flex vertical gap={16}>
      {
        docList && docList.map(doc => (
          <Popover
            rootClassName={styles.popover}
            trigger="click"
            getPopupContainer={triggerNode => triggerNode.parentElement || document.body}
            key={doc.document_url}
            content={() => {
              const items: PromptsProps['items'] = doc.chunks?.map((chunk: DocumentLinkMessage) => {
                return {
                  key: chunk.document_chunk_content,
                  type: 'text',
                  description: chunk.document_chunk_content,
                  disabled: true,
                };
              }) || [];
              return (
                <Prompts
                  title={doc.document_name}
                  items={items}
                  vertical
                  wrap
                  styles={{
                    item: {
                      flex: 'none',
                      width: '100%',
                    },
                  }}
                />
              );
            }}
          >
            <div key={doc.document_url} className={styles.documentItem}>
              <SvgIcon name="DocIcon" style={{ width: '14px', height: '14px' }}></SvgIcon>
              <span>{doc.document_name}</span>
              <RightOutlined style={{ width: '12px', height: '12px' }} />
            </div>
          </Popover>
        ))
      }
    </Flex>
  );
});

export default DocumentLink;
