import { getItem, setItem } from './utils';
const SSO_TOKEN_KEY = 'BMOS_SSO_TOKEN';
const SSO_USER_KEY = 'BMOS_SSO_USER';
const requestHeaderName = 'token';

const setUserToken = (userToken: string) => {
  setItem(SSO_TOKEN_KEY, userToken);
  return userToken;
};

const getUserToken = () => {
  return getItem(SSO_TOKEN_KEY) || '';
};

const getUserInfo = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SSO_USER_KEY) || '');
  } catch (error) {
    return null;
  }
};

const watcher$1 = {
  trigger: (...p) => {
    console.log(p);
  },
};

const setUserInfo = (userInfo: any) => {
  const currentUserInfo = getUserInfo();
  watcher$1.trigger(userInfo, currentUserInfo);
  try {
    sessionStorage.setItem(SSO_USER_KEY, userInfo ? JSON.stringify(userInfo) : '');
  } catch (error) {}
};

const navigatorLoginPage = (ssoUrl: string) => {
  location.replace(ssoUrl);
};

const openLogin = (): string => {
  return '';
};

async function defaultRequestAuth(_token, _configs) {
  // return await request(configs.ssoApi, token);
}
const service = async (configs, token) => {
  const requestAuth = configs.requestAuth || defaultRequestAuth;
  return await requestAuth(token, configs);
};

export const auth = async (configs: any) => {
  const finalConfigs = Object.assign({}, configs);
  const returnToSso = () => {
    setUserToken('');
    setUserInfo(null);
    navigatorLoginPage(finalConfigs.ssoUrl);
  };
  const sp = new URLSearchParams(location.search);
  let token = sp.get(requestHeaderName);
  if (!token) {
    token = getUserToken();
  }
  if (!token) {
    if (finalConfigs.ssoUrl) {
      returnToSso();
      throw new Error('未发现用户凭证，前往 sso 登录');
    } else {
      token = await openLogin();
    }
  }
  let userInfo;
  try {
    userInfo = await service(finalConfigs, token);
  } catch (err) {
    returnToSso();
    throw err;
  }

  setUserToken(token);
  setUserInfo(userInfo);
  return userInfo;
};
