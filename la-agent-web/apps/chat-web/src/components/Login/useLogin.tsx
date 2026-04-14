import { t } from '@bmos/i18n';
import { App, Modal } from 'antd';
import { useRef } from 'react';
import { userLogin } from '@/api';

import { setStoredToken } from '@/utils/token';

export const SERVICE_TYPE = 'MES';
export enum TerminalType {
  PC,
  PAD,
}

export const useLogin = () => {
  const { message } = App.useApp();

  const formRef = useRef<any>(null);
  const onSuccessLogin = async (userData: any) => {
    try {
      message.success(t('登录成功'));
      setStoredToken(userData.token);
      sessionStorage.setItem('BMOS_SSO_USER', JSON.stringify(userData));
      return true;
    }
    catch (_error) {
      return false;
    }
  };
  const login = async (formValues: { username: string; password: string }) => {
    try {
      const data = {
        loginName: formValues.username,
        password: formValues.password,
        serviceType: SERVICE_TYPE,
        terminalType: TerminalType.PC,
      };

      const res: any = await userLogin(data);

      if (res.code === 0) {
        const userData = res.data;
        switch (userData.activeStatus) {
          case 0:
            message.error(t('账号未激活，请先激活账号'));
            return false;

          case 2:
            message.error(t('您的密码已过有效期,需修改密码'));
            return false;

          case 1:
            if (userData.remindExpire) {
              return await new Promise<boolean>((resolve) => {
                Modal.confirm({
                  title: t('提示'),
                  content: t('您的密码即将到期，请尽快更换以保持账户安全。'),
                  okText: t('确定'),
                  cancelButtonProps: { style: { display: 'none' } },
                  keyboard: false,
                  closable: false,
                  onOk: async () => resolve(await onSuccessLogin(userData)),
                  onCancel: () => resolve(false),
                });
              });
            }
            else {
              return await onSuccessLogin(userData);
            }

          default:
            return false;
        }
      }
      return false;
    }
    catch (error: any) {
      message.error(t(error.message));
      if (error.code === 8104008) {
        message.error(t('您的密码已过有效期,需修改密码'));
      }
      return Promise.reject(error);
    }
  };

  return { formRef, login };
};
