import { SSO_TOKEN_KEY, SSO_USER_KEY } from '../const';

export const setItem = (key: string, val: string) => {
  try {
    localStorage.setItem(key, val);
  } catch (cause) {}
};

export const getItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (cause) {
    return null;
  }
};

export const setUserToken = (userToken: string) => {
  setItem(SSO_TOKEN_KEY, userToken);
  return userToken;
};

export const getUserToken = () => {
  return getItem(SSO_TOKEN_KEY) || '';
};

export const getUserInfo = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SSO_USER_KEY) || '');
  } catch (cause) {
    return null;
  }
};

export const setUserInfo = <T>(userInfo: T) => {
  // const currentUserInfo = getUserInfo();
  // watcher$1.trigger(userInfo, currentUserInfo);
  try {
    sessionStorage.setItem(
      SSO_USER_KEY,
      userInfo ? JSON.stringify(userInfo) : '',
    );
  } catch (cause) {}
};
