import { sso } from '@bmos/messager';

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
