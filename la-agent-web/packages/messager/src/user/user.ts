import { isArray } from '@bmos/utils';
import { appConfig, MESSAGE_CHANNEL_LOCK, requestHeaderName, ssoConfig } from '../const';
import { lockScreen, registerMessage } from '../messager';
import { hasBridge } from './bridge';
import { getUserInfo, getUserToken, setUserInfo, setUserToken } from './info';
import { loginOnMessage, navigatoFrom, navigatorLoginPage } from './navigate';
import { service } from './service';

const testConfigs = (configs: object) => {
  const defaults = {
    ssoUrl: void 0,
    ssoApi: '/api/app/agent/auth/status',
  };
  return Object.assign(defaults, configs);
};

const openLogin = async () => {
  return new Promise<string>((resolve, _reject) => {
    resolve('token');
  });
};

const auth = async (configs?: object) => {
  let _a: any;
  const finalConfigs = testConfigs(configs || {}) as any;
  const returnToSso = () => {
    setUserToken('');
    setUserInfo(null);
    navigatorLoginPage();
  };
  // const { matcher } = finalConfigs;
  let { excludes } = finalConfigs;
  if (!isArray(excludes)) excludes = [excludes];
  // if (!shouldAuth(matcher, excludes)) return;
  const params = new URLSearchParams(location.search);
  let token = params.get(requestHeaderName);

  if (!token && hasBridge()) {
    token = getUserToken();
  }
  if (!token) {
    token = getUserToken();
  }
  if (!token) {
    if (hasBridge()) {
      token = await openLogin();
    } else {
      returnToSso();
      throw new Error('未发现用户凭证，前往 sso 登录');
    }
  }
  if (!token) {
    returnToSso();
    throw new Error('无法获取到用户凭证，请检查单点登录系统是否正常');
  }

  history.replaceState(
    null,
    '',
    ((_a = appConfig.ssoReturnUrl) === null ? void 0 : _a?.call(appConfig)) || ssoConfig.returnUrl(),
  );

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

const vertify = {
  auth,
  getUserInfo,
  getUserToken,
  setUserInfo,
  setUserToken,
  ssoConfig,
  navigatorLoginPage,
  navigatoFrom,
  requestHeaderName,
};

export const app = {
  navigatorLoginPage,
  navigatoFrom,
};

export const sso = vertify;
export const loginRegist = loginOnMessage;
export { lockScreen, MESSAGE_CHANNEL_LOCK, registerMessage };
export const Auth = auth;
export default vertify;
