import type { GetRef, MenuProps } from 'antd';
import type { Props, SearchOnlineMessage } from './type';
import type { AgentInfoType } from '@/stores/agent';
import { CloseOutlined, CloudUploadOutlined, DownOutlined } from '@ant-design/icons';
import { Attachments, Bubble, Sender } from '@ant-design/x';
import { t } from '@bmos/i18n';
import { isEmpty } from '@bmos/utils';
import { App, Button, Drawer, Dropdown, Flex, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteConversation, getAgents, getLastUseAgent } from '@/api';
import ChangeChatNameModal from '@/components/ChangeChatName';
import SvgIcon from '@/components/SvgIcon';
import { useAgentStore } from '@/stores/agent';
import { useLoginModalStore } from '@/stores/loginModalStore';
import { getStoredToken } from '@/utils/token';
import { generateWatermark } from '@/utils/watermark';
import FeedbackModal from '../FeedbackModal';
import OnlineCard from '../OnlineCard';
import { useChatAgent, useStyle } from './hooks';
import { ConversationType, DropdownKeys } from './type';
import './index.less';

const token = getStoredToken();

const ChatCom: React.FC<Props> = ({
  agentId,
  modelId,
  conversationId,
  type = ConversationType.conversation,
  canLike = true,
}) => {
  // ==================== Style ====================
  const { styles } = useStyle();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { getAgent, setAgent, setAgentName } = useAgentStore();

  // ===================== 聊天消息相关 ====================
  const {
    agent,
    conversationInfo,
    setConversationInfo,
    setMessages,
    getConversation,
    online,
    setOnline,
    feedbackRef,
    handleFeedback,
    roles,
    msgItems,
    content,
    setContent,
    onSubmit,
    onCancel,
    drawerOpen,
    setDrawerOpen,
    searchResult,
    controller,
    fileItems,
    setFileItems,
    openAttachment,
    setOpenAttachment,
  } = useChatAgent(canLike);

  // 附件ref
  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

  // 输入框ref
  const senderRef = React.useRef<GetRef<typeof Sender>>(null);
  // 获取用户信息
  // const userData = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');

  // 获取水印
  const watermark = generateWatermark('BMOS-AGENT');

  const [modal, contextHolder] = Modal.useModal();

  const { show } = useLoginModalStore();

  // 未登录
  const loginPlease = (
    <div className={styles.placeholder}>
      <a target="_blank" style={{ color: '#2871FF' }} onClick={show}>{t('立即登录')}</a>
      ，
      <span>{t('向我提问')}</span>
    </div>
  );

  // 上传文件
  const senderHeader = (
    <Sender.Header
      title={t('附件')}
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={openAttachment}
      onOpenChange={setOpenAttachment}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        overflow="wrap"
        beforeUpload={() => false}
        items={fileItems}
        imageProps={{
          width: 68,
          height: 68,
        }}
        onChange={({ fileList }) => setFileItems(fileList)}
        placeholder={type =>
          type === 'drop'
            ? {
                title: t('将文件拖到此处'),
              }
            : {
                icon: <CloudUploadOutlined />,
                title: t('上传文件'),
                description: t('单击或拖动文件到此区域进行上传'),
              }}
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </Sender.Header>
  );

  // 输入框操作
  const senderFooter = ({ components }: { components: any }) => {
    const { SendButton, LoadingButton } = components;
    return (
      <Flex justify="space-between" align="center">
        {
          !modelId?.length
            ? (
                <Flex gap="small" align="center">
                  <Button
                    className={online ? styles.OnlineActive : ''}
                    disabled={!token}
                    onClick={() => setOnline(!online)}
                  >
                    <SvgIcon name="Online" size={14} />
                    {t('联网搜索')}
                  </Button>
                </Flex>
              )
            : <span></span>
        }
        <Flex align="center">
          {
            !modelId?.length && (
              <Button
                type="text"
                disabled={!token}
                icon={<SvgIcon name="Link" />}
                onClick={() => {
                  setOpenAttachment(!openAttachment);
                }}
              />
            )
          }
          {agent.isRequesting()
            ? (
                <LoadingButton type="default" />
              )
            : (
                <SendButton type="primary" disabled={!token} style={{ borderRadius: 12 }} icon={<SvgIcon name="Send" />} />
              )}
        </Flex>
      </Flex>
    );
  };

  // 消息体为空时默认显示内容
  const emptyContent = (
    <div className={styles.emptyContent}>{t('你好，你可以随时向我提问')}</div>
  );

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setMessages([]);
        return;
      }
      // helper: 设置 agent 和会话信息
      const applyAgentAndConversation = (
        agentInfo: AgentInfoType,
        conversation_id?: string,
      ) => {
        setAgent({
          id: agentInfo.id,
          name: agentInfo.name,
          icon_url: agentInfo.icon_url,
        });
        setConversationInfo(prev => ({
          ...prev,
          agent_id: agentInfo.id,
          agent_avatar: agentInfo.icon_url,
          name: agentInfo.name,
          conversation_id,
        }));
      };

      try {
        if (conversationId) {
          const agentInfo = agentId
            ? { id: agentId, name: getAgent().name, icon_url: getAgent().icon_url }
            : getAgent();
          applyAgentAndConversation(agentInfo, conversationId);
          getConversation(conversationId);
          return;
        }

        if (agentId) {
          const res = await getAgents({ id: agentId });
          const data = res?.data?.[0];
          if (data) {
            applyAgentAndConversation({
              id: data.id,
              name: data.name,
              icon_url: data.icon_url,
            });
          }
          return;
        }
        if (modelId) {
          setConversationInfo({
            model_id: modelId,
          });
          return;
        }

        const lastUseRes = await getLastUseAgent();
        const lastData = lastUseRes?.data;

        if (lastData) {
          applyAgentAndConversation({
            id: lastData.agent_id,
            name: lastData.agent_name,
            icon_url: lastData.agent_avatar,
          });
        }
        else {
          const res = await getAgents();
          const data = res?.data?.[0];
          if (data) {
            applyAgentAndConversation({
              id: data.id,
              name: data.name,
              icon_url: data.icon_url,
            });
          }
        }
      }
      catch (err: any) {
        err?.message && message.error(err.message);
      }
    };
    init();
    return () => {
      controller.current.abort();
    };
  }, []);

  // useLayoutEffect(() => {
  //   const isRequesting = agent.isRequesting();
  //   if (!isRequesting) {
  //     const messageContainer = document.getElementById(`messageContainer`) as HTMLDivElement;
  //     if (!messageContainer) {
  //       return;
  //     }
  //     // console.log('messageContainer', messageContainer)
  //     const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  //     messageContainer.scrollTo({
  //       top: messageContainer?.scrollHeight,
  //       behavior: supportsSmoothScroll ? 'smooth' : 'auto',
  //     });
  //   }
  // }, [agent]);

  const dropDownMenu: MenuProps['items'] = [
    {
      label: t('修改名称'),
      key: DropdownKeys.edit,
      icon: <SvgIcon name="Edit" />,
    },
    {
      label: t('删除对话'),
      key: DropdownKeys.delete,
      danger: true,
      icon: <SvgIcon name="Delete" />,
    },
  ];

  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);

  const changeName = (id: string, name: string) => {
    setConversationInfo({ ...conversationInfo, name });
    setAgentName(name);
  };

  const onClickDropdown: MenuProps['onClick'] = ({ key }) => {
    // message.info(`Click on item ${key}`);
    switch (key) {
      case DropdownKeys.edit:
        setChangeNameModalOpen(true);
        break;
      case DropdownKeys.delete:
        if (conversationInfo?.conversation_id === undefined) {
          message.warning(t('当前对话为新对话，无法删除'));
          return;
        }
        modal.confirm({
          title: `${t('确定删除对话')}？`,
          content: `${t('删除后，聊天记录将不可恢复')}。`,
          okText: t('确定'),
          cancelText: t('取消'),
          okButtonProps: {
            danger: true,
          },
          onOk: async () => {
            // 删掉 data 中 id
            await deleteConversation({ id: conversationInfo?.conversation_id });
            message.success(t('删除成功'));
            const time = new Date().getTime();
            navigate(`/main-chat?t=${time}`);
          },
          onCancel: () => {

          },
        });
        break;
      default:
        break;
    }
  };

  // ==================== Render =================
  return (
    <div className={styles.layout} style={{ backgroundImage: `url(${watermark})` }}>
      {contextHolder}
      <ChangeChatNameModal
        open={changeNameModalOpen}
        id={conversationInfo?.conversation_id as string}
        name={conversationInfo?.name as string}
        onCancel={() => { setChangeNameModalOpen(false); }}
        onFinish={(id, name) => changeName(id, name)}
      />
      <div className={styles.chat}>
        {/* 会话名称编辑/删除 */}
        {!window?.$wujie && token && (
          <div className={styles.dropdown}>
            <Dropdown disabled={conversationInfo?.conversation_id === undefined} menu={{ items: dropDownMenu, onClick: onClickDropdown }} trigger={['click']}>
              <Flex align="center" justify="center" gap={8}>
                <img src={getAgent().icon_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <div className={styles.conversationName}>{conversationInfo?.name}</div>
                {conversationInfo?.conversation_id && <DownOutlined />}
              </Flex>
            </Dropdown>
          </div>
        )}
        {
          msgItems.length > 0
            ? (
                <Bubble.List
                  id="messageContainer"
                  items={msgItems}
                  roles={roles}
                  className={styles.messages}
                />
              )
            : emptyContent
        }
        {/* 🌟 输入框 */}
        {
          type === ConversationType.conversation
          && (
            <Sender
              ref={senderRef}
              value={content}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onChange={setContent}
              loading={agent.isRequesting()}
              placeholder={t('请提问...')}
              className={styles.sender}
              header={isEmpty(modelId) ? (token ? senderHeader : loginPlease) : null}
              disabled={!token}
              onPasteFile={(_, files) => {
                for (const file of files) {
                  attachmentsRef.current?.upload(file);
                }
                setOpenAttachment(true);
              }}
              actions={false}
              footer={senderFooter}
            />
          )
        }
        {/* 联网搜索内容 */}
        <Drawer
          title={t('引用参考')}
          mask={false}
          maskClosable={false}
          getContainer={false}
          open={drawerOpen}
          closeIcon={false}
          extra={<CloseOutlined onClick={() => setDrawerOpen(false)} />}
        >
          {
            searchResult.map((item: SearchOnlineMessage, index: number) => (
              <OnlineCard key={item.url} onlineMessage={item} index={index + 1} />
            ))
          }
        </Drawer>
      </div>
      {/* 🌟 反馈 */}
      <FeedbackModal ref={feedbackRef} onSubmit={handleFeedback} />
    </div>
  );
};

export default ChatCom;
