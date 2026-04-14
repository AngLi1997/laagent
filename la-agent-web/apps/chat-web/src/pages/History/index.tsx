import { deleteAllConversation, deleteConversation, getConversationPage } from '@/api';
import ChangeChatNameModal from '@/components/ChangeChatName';
import SvgIcon from '@/components/SvgIcon';
import { t } from '@bmos/i18n';
import { App, Button, Divider, Input, List, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation, useNavigate } from 'react-router-dom';

const useStyle = createStyles(({ css }) => {
  return {
    container: css`
      width: 780px;
      height: 100%;
      margin: 0 auto;
    `,
    header: css`
      & .title {
        color: #000;
        font-size: 30px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-align: center;
      }
      & .clearHistory {
        text-align: right;
      }
    `,
    search: css`
      margin: 26px 0 12px 0;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--bmos-first-level-border-color);
      background: #FFF;
    `,
    scrollDev: css`
      height: calc(100% - 164px);
      overflow: auto;
    `,
    list: css`
      & .ant-list-item {
        height: 40px;
        margin-bottom: 24px;
        border-block-end: 0px;
        border-radius: 12px;
        background: #FFF;
        padding: 10px 16px;
        cursor: pointer;
        & .date {
          display: block;
          width: 100px;
          text-align: right;
        }
        & .actions {
          display: none;
          width: 100px;
        }
      }
      & .ant-list-item-meta {
        align-items: center;
        & .ant-list-item-meta-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }
      & .ant-list-item-meta-avatar {
        display: flex;
        align-items: center;
      }
      & .ant-list-item:hover {
        & .date {
          display: none;
        }
        & .actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
      }
    `,
  };
});

const History: React.FC = () => {
  const { message } = App.useApp();
  const { styles } = useStyle();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const pageSize = 50;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const getHistory = async (currentData: any, currentPageNum: number) => {
    try {
      const res = await getConversationPage({
        page_num: currentPageNum,
        page_size: pageSize,
        conversation_title,
      });
      if (pageNum * pageSize >= res.data.total) {
        setHasMore(false);
      }
      if (res.data.data && res.data.data.length > 0) {
        setData([...currentData, ...res.data.data]);
      }
    }
    catch (_error) {
      setHasMore(false);
      return Promise.reject(_error);
    }
  };
  const loadMoreData = async (currentData: any, currentPageNum: number) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await getHistory(currentData, currentPageNum);
      setPageNum(currentPageNum + 1);
    }
    finally {
      setLoading(false);
    }
  };

  const searchHistory = async () => {
    if (loading) {
      return;
    }
    setData([]);
    setPageNum(1);
    loadMoreData([], 1);
  };

  const changeName = () => {
    searchHistory();
  };

  useEffect(() => {
    loadMoreData(data, pageNum);
  }, []);

  const handleList = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/main-chat?id=${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    modal.confirm({
      title: `${t('确定删除对话')}？`,
      content: `${t('删除后，聊天记录将不可恢复')}。`,
      okText: t('确定'),
      cancelText: t('取消'),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await deleteConversation({ id });
          message.success(t('删除成功'));
          searchHistory();
        }
        catch (error: any) {
          error.message && message.error(error.message);
        }
      },
      onCancel: () => {

      },
    });
  };

  const clearAll = () => {
    modal.confirm({
      title: `${t('确定清空所有对话')}？`,
      content: `${t('清空后，聊天记录将不可恢复')}。`,
      okText: t('确定'),
      cancelText: t('取消'),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await deleteAllConversation();
          message.success(t('清空成功'));
          searchHistory();
        }
        catch (error: any) {
          error.message && message.error(error.message);
        }
      },
      onCancel: () => {

      },
    });
  };

  const [conversation_title, setConversationTitle] = useState('');
  const [changeNameId, setChangeNameId] = useState('');
  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <div key={searchParams.get('t')} className={styles.container}>
      {contextHolder}
      <ChangeChatNameModal
        open={changeNameModalOpen}
        id={changeNameId}
        name={data.find(item => item.conversation_id === changeNameId)?.conversation_title}
        onCancel={() => { setChangeNameModalOpen(false); }}
        onFinish={() => changeName()}
      />
      <div className={styles.header}>
        <div className="title">{t('历史对话')}</div>
        <Input
          value={conversation_title}
          placeholder={t('搜索历史对话')}
          className={styles.search}
          onChange={e => setConversationTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchHistory()}
          suffix={(<SvgIcon name="Search" style={{ cursor: 'pointer' }} size={24} onClick={() => searchHistory()} />)}
        />
        <div className="clearHistory">
          <Button type="link" danger icon={(<SvgIcon name="Delete" size={16} />)} onClick={clearAll}>
            {t('清空对话')}
          </Button>
        </div>
      </div>
      <div
        id="scrollableDiv"
        className={styles.scrollDev}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={() => loadMoreData(data, pageNum)}
          hasMore={hasMore}
          loader={null}
          endMessage={data && data.length > 0 && <Divider plain>{t('没有更多了')}</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            className={styles.list}
            renderItem={item => (
              <List.Item key={item.conversation_id} onClick={e => handleList(e, item.conversation_id)}>
                <List.Item.Meta
                  avatar={item.agent_avatar ? <img src={item.agent_avatar} style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> : <SvgIcon name={`DefaultAgentAvatar${Math.floor(Math.random() * 4) + 1}`} size={20} />}
                  title={item.conversation_title}
                />
                <div className="date">{item.last_chat_time}</div>
                <div className="actions">
                  <SvgIcon
                    name="Edit"
                    size={18}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setChangeNameId(item.conversation_id);
                      setChangeNameModalOpen(true);
                    }}
                  />
                  <SvgIcon name="Delete" size={18} onClick={e => handleDelete(e, item.conversation_id)} />
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default History;
