import type { TabsProps } from 'antd';
import { t } from '@bmos/i18n';
import { App, Button, Input, List, Modal, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { createFeedback, getFeedbackHistory } from '@/api';
import SvgIcon from '@/components/SvgIcon';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { FeedbackEnum } from '../type';

const { TextArea } = Input;

const useStyle = createStyles(({ css }) => {
  return {
    listItemTitle: css`
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
    `,
    listItemTitleHeader: css`
      display: inline-flex;
      gap: 8px;
      flex: 1;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    listItemTitleHeaderTitle: css`
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    listItemReply: css`
      display: flex;
      padding: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
      align-self: stretch;
      border-radius: 8px;
      background: var(--bmos-background-color);
    `,
    listItemReplyTitle: css`
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: var(--bmos-third-level-text-color);
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
    `,
    listItemReplyContent: css`
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    `,
    tabPane: css`
      min-height: 400px;
    `,
    footerBtn: css`
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0;
    `,
  };
});

interface FeedbackProps {
  open: boolean;
  type: FeedbackEnum;
  onClose: () => void;
}

const FeedBack: React.FC<FeedbackProps> = ({ open, type = FeedbackEnum.new, onClose }) => {
  const { styles } = useStyle();
  const [activeTab, setActiveTab] = useState(type);

  const { message } = App.useApp();

  // const pageSize = 10;
  // const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  // const [pageNum, setPageNum] = useState(1);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setActiveTab(type);
    const init = async () => {
      if (type === FeedbackEnum.history) {
        try {
          const { data } = await getFeedbackHistory();
          setData(data);
        }
        catch (error: any) {
          error.message && message.error(error.message);
        }
      }
    };
    init();
    return () => {
      setData([]);
    };
  }, [type]);

  const handleTabChange = async (key: string) => {
    setActiveTab(key as FeedbackEnum);
    if (key === FeedbackEnum.history) {
      try {
        const { data } = await getFeedbackHistory();
        setData(data);
      }
      catch (error: any) {
        error.message && message.error(error.message);
      }
    }
  };

  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = async () => {
    try {
      await createFeedback({ msg: feedbackText });
      message.success(t('反馈成功'));
      setFeedbackText('');
      onClose();
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: FeedbackEnum.new,
      label: t('新增反馈'),
      children: (
        <div className={styles.tabPane}>
          <p>{t('欢迎说说您的想法，BMOS会努力做的更好！')}</p>
          <TextArea
            rows={4}
            placeholder={t('请告诉我们你的想法...')}
            value={feedbackText}
            style={{
              marginTop: '16px',
            }}
            onChange={e => setFeedbackText(e.target.value)}
          />
          <div className={styles.footerBtn}>
            <Button onClick={onClose} style={{ marginRight: 16 }}>
              {t('取消')}
            </Button>
            <Button type="primary" onClick={handleFeedbackSubmit} disabled={!feedbackText.length}>
              {t('确定')}
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: FeedbackEnum.history,
      label: t('反馈历史'),
      children: (
        <div
          id="scrollableDiv"
          style={{
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
          }}
        >
          {/* <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={null}
            endMessage={data && data.length > 0 && <Divider plain>{t('没有更多了')}</Divider>}
            scrollableTarget="scrollableDiv"
          > */}
          <List
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={(
                    <div className={styles.listItemTitle}>
                      <span className={styles.listItemTitleHeader}>
                        <SvgIcon name="FeedbackChat" size={16} />
                        <span className={styles.listItemTitleHeaderTitle}>{item.msg}</span>
                      </span>
                      {item.feedback_time}
                    </div>
                  )}
                  description={
                    item.replies.map((reply: any) => (
                      <div key={reply.id} className={styles.listItemReply}>
                        <div className={styles.listItemReplyTitle}>
                          <div>{reply.reply_user}</div>
                          <span>
                            {t('回复')}
                            ：
                          </span>
                          <div style={{ marginLeft: 'auto' }}>{reply.reply_time}</div>
                        </div>
                        <span className={styles.listItemReplyContent}>{reply.reply_msg}</span>
                      </div>
                    ))
                  }
                />
              </List.Item>
            )}
          />
          {/* </InfiniteScroll> */}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
    </Modal>
  );
};

export default FeedBack;
