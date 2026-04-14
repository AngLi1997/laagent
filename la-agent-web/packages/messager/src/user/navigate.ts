import { urlSetParams } from '@bmos/utils';
import { appConfig, redirectQueryName, requestHeaderName, SSO_URL, ssoConfig } from '../const';
import { loginNavi } from '../messager';

const { MESSAGE } = loginNavi;
export const navigatorLoginPage = () => {
  location.href = SSO_URL;
};

const SSO_BASE_URL = '/app/bmos-ai/';

const getReturnUrl = () => {
  const { origin } = location;
  return origin + SSO_BASE_URL;
};

export const navigatoFrom = (token?: string) => {
  const returnUrl = getReturnUrl();
  if (!token) {
    location.replace(returnUrl);
    return;
  }

  location.replace(urlSetParams(returnUrl, { [requestHeaderName]: token }));
};

export const loginOnMessage = (on: boolean = false) => {
  if (on) {
    window.top?.addEventListener('message', (e) => {
      if (e.data === MESSAGE) {
        const base = SSO_URL;
        if (base) {
          const replaceUrl = urlSetParams(base, {
            [redirectQueryName]:
              appConfig.ssoReturnUrl?.() || ssoConfig.returnUrl(),
          });
          location.replace(replaceUrl);
        }
      }
    });
  }
};
