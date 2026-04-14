import { MESSAGE_CHANNEL_LOCK, MESSAGE_CHANNEL_LOGIN } from '../const';
import { RegisterMessage, RegisterPostMessage } from './type';

export const registerMessage: RegisterMessage = (CHANNEL, callback = () => {}) => {
  if (CHANNEL) {
    window.top?.addEventListener('message', e => {
      if (e.data === CHANNEL) {
        callback(e);
      }
    });
  }
};

export const registerPostMessage: RegisterPostMessage = CHANNEL => {
  try {
    if (window.top === window) {
      window.postMessage(CHANNEL, '*');
    } else {
      window.parent?.postMessage(CHANNEL, '*');
    }
  } catch (error) {
    console.log(error);
  }
};

const lockMessage = () => {
  registerPostMessage(MESSAGE_CHANNEL_LOCK);
};

const loginMessage = () => {
  registerPostMessage(MESSAGE_CHANNEL_LOGIN);
};

const lockScreen = {
  lockMessage,
  MESSAGE: MESSAGE_CHANNEL_LOCK,
};

const loginNavi = {
  loginMessage,
  MESSAGE: MESSAGE_CHANNEL_LOGIN,
};

export { lockScreen, loginNavi };
