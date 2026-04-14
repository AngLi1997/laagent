import type { SearchOnlineMessage } from '../ChatCom/type';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import SvgIcon from '../SvgIcon';

const { Paragraph } = Typography;

export interface OnlineCardProps {
  onlineMessage: SearchOnlineMessage;
  index: number;
}

const useStyle = createStyles(({ css }) => {
  return {
    card: css`
      display: block;
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      :hover {
        background: #F7F8FA;
      }
    `,
    header: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    `,
    index: css`
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      background: #E8EAED;
      line-height: 16px;
      text-align: center;
      padding: 0 4px;
      color: #606266;
      font-size: 10px;
    `,
    title: css`
      .ant-typography {
        color: #242526;
        font-family: "Source Han Sans CN";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        margin-bottom: 8px;
      }
    `,
    content: css`
      .ant-typography {
        color:  #909398;
        font-family: "Source Han Sans CN";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        margin-bottom: 8px;
      }
    `,
  };
});

const OnlineCard: React.FC<OnlineCardProps> = memo(({ onlineMessage, index }) => {
  const { styles } = useStyle();
  return (
    <a className={styles.card} href={onlineMessage.url} target="_blank">
      <div className={styles.header}>
        <SvgIcon name="网络图标" />
        <span style={{ color: '#606266' }}>BMOS网</span>
        <span style={{ color: '#C1C4CB' }}>{dayjs().format('YYYY-MM-DD')}</span>
        <div className={styles.index} style={{ marginLeft: 'auto' }}>{index}</div>
      </div>
      <div className={styles.title}>
        <Paragraph ellipsis={{ rows: 2 }}>
          {onlineMessage.title}
        </Paragraph>
      </div>
      <div className={styles.content}>
        <Paragraph ellipsis={{ rows: 2 }}>
          {onlineMessage.result}
        </Paragraph>
      </div>
    </a>
  );
});

export default OnlineCard;
