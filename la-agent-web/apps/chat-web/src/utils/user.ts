import { getPlatformUserStatus, reqAgentConfigsUserGet } from '@/api';

export const getAvatar = async () => {
  try {
    // 更新 BMOS_SSO_USERsessionStorage.setItem('BMOS_SSO_USER', JSON.stringify(userData));
    const userData = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
    const { data } = await reqAgentConfigsUserGet();
    sessionStorage.setItem('BMOS_SSO_USER', JSON.stringify({
      ...userData,
      avatar: data.icon_url,
    }));
  }
  catch (_error) {
    // 不能删，删除后头像无法加载
    console.log(_error);
  }
};

export const getUserInfo = async () => {
  try {
    // 更新 BMOS_SSO_USERsessionStorage.setItem('BMOS_SSO_USER', JSON.stringify(userData));
    const userData = JSON.parse(sessionStorage.getItem('BMOS_SSO_USER') || '{}');
    const { data } = await getPlatformUserStatus();
    sessionStorage.setItem('BMOS_SSO_USER', JSON.stringify({
      ...userData,
      ...data,
    }));
  }
  catch (_error) {
    // 不能删，删除后头像无法加载
    console.log(_error);
  }
};
