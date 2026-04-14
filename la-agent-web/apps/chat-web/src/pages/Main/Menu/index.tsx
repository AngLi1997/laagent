import type { MenuProps } from 'antd';
import type { MenuItem } from './type';
import AvatarModal from '@/components/Avatar';
import ChangePasswordModal from '@/components/ChangePassword';
import SvgIcon from '@/components/SvgIcon';
import { t } from '@bmos/i18n';
import { Dropdown, Menu } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedBack from './components/FeedBack';
import { useAgent, useFeedback, usePersonal } from './hooks';
import { FeedbackEnum } from './type';

const useStyle = createStyles(({ css }) => {
  return {
    menuContent: css`
      width: 102px;
      display: inline-flex;
      padding: 20px 8px 12px 8px;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      position: absolute;
      left: 20px;
      border-radius: 8px;
      background: #F7F8FA;
      box-shadow: 2px 0px 6px 0px rgba(0, 0, 0, 0.15);
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
    `,
    avatar: css`
      width: 40px;
      height: 40px;
      aspect-ratio: 1/1;
      cursor: pointer;
      border-radius: 50%;
    `,
    menuList: css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    `,
    menuItem: css`
      display: flex;
      padding: 8px;
      align-items: center;
      gap: 8px;
      color: #606266;
      align-self: stretch;
      border-radius: 6px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 128.571% */
      cursor: pointer;

      &:hover {
        background: #fff;
      }
    `,
    menuListContainer: css`
      &.ant-menu-root {
        width: 102px !important;
      }
      & .ant-menu-item {
        padding-inline: 8px;
        display: flex;
        align-items: center;
      }
      & .ant-menu-item-active {
        background: #fff;
      }
      & .ant-menu-submenu-title {
        padding-inline-end: 0px;
        padding-inline: 8px;
        display: flex;
        align-items: center;
        & .ant-menu-submenu-arrow {
          display: none;
        }
      }
      &.ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub {
        max-height: 300px;
      }
      & .ant-menu-sub {
        & .ant-menu-item:hover {
          background: #F5F7FA !important;
        }
      }
    `,

  };
});

const MenuComponent: React.FC = () => {
  const { styles } = useStyle();
  const {
    changePasswordModalOpen,
    setChangePasswordModalOpen,
    avatarMenuitems,
    contextHolder,
    setAvatarModalOpen,
    setSetAvatarModalOpen,
    finishUpdateAvatar,
    avatarUrl,
    setAvatarUrl,
  } = usePersonal();
  const { feedbackModalOpen, setFeedbackModalOpen, feedbackMenuList, feedbackType, openFeedbackModal } = useFeedback();
  const { setActiveAgent, agentMenuList, getAgentList } = useAgent();
  const navigate = useNavigate();

  const menuList: MenuItem[] = [
    {
      icon: <SvgIcon name="NewDialogue" size={16}></SvgIcon>,
      label: t('新对话'),
      key: 'newDialogue',
    },
    {
      icon: <SvgIcon name="History" size={16}></SvgIcon>,
      label: t('历史'),
      key: 'history',
    },
    {
      icon: <SvgIcon name="Agent" size={16}></SvgIcon>,
      label: t('智能体'),
      key: 'agent',
      children: agentMenuList,
    },
    {
      icon: <SvgIcon name="Feedback" size={16}></SvgIcon>,
      label: t('反馈'),
      key: 'feedback',
      children: feedbackMenuList,
    },
  ];

  const onClickMenu: MenuProps['onClick'] = (e: any) => {
    const time = new Date().getTime();
    switch (e.key) {
      case 'newDialogue':
        navigate(`/main-chat?t=${time}`);
        break;
      case 'history':
        navigate(`/history?t=${time}`);
        break;
      case FeedbackEnum.new:
        openFeedbackModal(FeedbackEnum.new);
        break;
      case FeedbackEnum.history:
        openFeedbackModal(FeedbackEnum.history);
        break;
      default:
        setActiveAgent(e.key);
        navigate(`/main-chat?t=${time}&agentId=${e.key}`);
        break;
    }
  };

  useEffect(() => {
    getAgentList();
    const userInfo = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
    setAvatarUrl(userInfo.avatar || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.menuContent}>
      <Dropdown menu={{ items: avatarMenuitems }} trigger={['click']}>
        {
          avatarUrl?.length ? <img src={avatarUrl} alt="User Avatar" className={styles.avatar} /> : <SvgIcon name="DefaultAvatar" size={40} className={styles.avatar} />
        }
      </Dropdown>
      <div className={styles.menuList}>
        <Menu rootClassName={styles.menuListContainer} triggerSubMenuAction="click" selectable={false} theme="light" onClick={onClickMenu} style={{ width: 256 }} mode="vertical" items={menuList} />
      </div>
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onCancel={() => setChangePasswordModalOpen(false)}
      />
      <FeedBack
        open={feedbackModalOpen}
        type={feedbackType}
        onClose={() => setFeedbackModalOpen(false)}
      />

      <AvatarModal
        open={setAvatarModalOpen}
        onCancel={() => setSetAvatarModalOpen(false)}
        onFinish={() => finishUpdateAvatar()}
      />
      {contextHolder}
    </div>
  );
};

export default MenuComponent;
