import type { MenuProps } from 'antd';
import { reqAgentConfigsUserGet } from '@/api';
import { t } from '@bmos/i18n';
import { Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePersonal = () => {
  const navigate = useNavigate();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const [setAvatarModalOpen, setSetAvatarModalOpen] = useState(false);
  const finishUpdateAvatar = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
      const { data } = await reqAgentConfigsUserGet();
      sessionStorage.setItem('BMOS_SSO_USER', JSON.stringify({
        ...userData,
        avatar: data.icon_url,
      }));
      setAvatarUrl(data);
    }
    catch (_error) {
      //
    }
  };
  const avatarMenuitems: MenuProps['items'] = [
    {
      key: 'updateAvatar',
      label: (
        <span onClick={() => setSetAvatarModalOpen(true)}>
          {t('修改头像')}
        </span>
      ),
    },
    {
      key: 'updatePassword',
      label: (
        <span onClick={() => setChangePasswordModalOpen(true)}>
          {t('修改密码')}
        </span>
      ),
    },
    {
      key: 'logout',
      label: (
        <span onClick={() => {
          modal.confirm({
            title: t('退出登录'),
            content: t('退出登录不会丢失任何数据，你仍可以随时登录本账号。'),
            okText: t('退出登录'),
            cancelText: t('取消'),
            okButtonProps: {
              danger: true,
            },
            onOk: () => {
              // 退出登录
              localStorage.removeItem('BMOS-ACCESS-TOKEN');
              sessionStorage.removeItem('BMOS_SSO_USER');
              // window.location.reload();
              const time = new Date().getTime();
              navigate(`/main-chat?t=${time}`);
            },
            onCancel: () => { },
          });
        }}
        >
          {t('退出登录')}
        </span>
      ),
    },
  ];
  return {
    changePasswordModalOpen,
    setChangePasswordModalOpen,
    avatarMenuitems,
    contextHolder,
    setAvatarModalOpen,
    setSetAvatarModalOpen,
    finishUpdateAvatar,
    avatarUrl,
    setAvatarUrl,
  };
};
