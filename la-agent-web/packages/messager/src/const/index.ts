import { urlDelParams } from '@bmos/utils';

export const SSO_TOKEN_KEY = 'BMOS-ACCESS-TOKEN';

export const SSO_USER_KEY = 'BMOS-ACCESS-USER';

export const redirectQueryName = 'return';
export const requestHeaderName = 'bmos-access-token';

export const appConfig = {
  ssoReturnUrl: void 0,
};

export const SSO_URL = location.origin + '/app/bmos-ai/login/index.html';

export const DEFAULT_URL = location.origin + '/app/bmos-ai/';

export const ssoConfig = {
  returnUrl: () => urlDelParams(location.href, [requestHeaderName, redirectQueryName]),
  watchInterval: 9876,
};

export const LOGIN_IN = 'LOGIN_IN';
export const LOGIN_OUT = 'LOGIN_OUT';
export const LOCK_SCR = 'LOCK_SCR';

export const MESSAGE_CHANNEL_LOCK = 'LOCK_MESSAGE';

export const MESSAGE_CHANNEL_LOGIN = 'LOGIN_MESSAGE';
