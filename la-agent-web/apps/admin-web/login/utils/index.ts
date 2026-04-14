import { t } from '@bmos/i18n';
import { sso } from '@bmos/messager';

import { getIp } from '@bmos/utils';

import { Modal } from 'ant-design-vue';

import browser from 'browser-tool';

const { navigatoFrom, setUserInfo, setUserToken } = sso;

interface SysUser {
  loginName?: string;
  password?: string;
  rentalIdList?: string[];
  status?: string;
  token?: string;
  userId?: string;
}

export const setUser = (userInfo: SysUser) => {
  const { token = '' } = userInfo;

  setUserToken(token);
  setUserInfo(userInfo);
  sessionStorage.setItem('BMOS_SSO_USER', JSON.stringify(userInfo));
  navigatoFrom(token);
};

export const setLanguage = (val: string) => {
  localStorage.setItem('LANG', val);
};

export const vertify_chrome = () => {
  // 同步获取信息
  // console.log(browser());

  // 异步获取信息(结果更为全面)
  browser.getInfo().then(bs => {
    const firstChar = bs.browserVersion.split('.')[0];
    if (bs.browser === 'Chrome' && parseInt(firstChar) >= 122) {
      return;
    }
    // 正则匹配字符串'windows'，不区分大小写
    const isWindows = /windows/i.test(bs.system);
    Modal.confirm({
      title: t('浏览器不匹配'),
      content: t('浏览器版本不匹配，请重新下载浏览器！'),
      okText: isWindows ? t('立即下载') : t('非windows系统,请自行下载'),
      cancelText: t('取消'),
      maskStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      onOk() {
        if (isWindows) {
          // 下载google浏览器
          const link = document.createElement('a');
          link.href = getIp() + `front-end/download/chrome/ChromeStandaloneSetup${bs.bitness || 64}.exe`;
          link.download = 'ChromeStandaloneSetup64.exe';
          link.click();
        }
      },
    });
  });
};
