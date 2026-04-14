import { MESSAGE_CHANNEL_LOCK, registerMessage } from '@bmos/messager';
const LOCK_STATUS = '_lock';

export const setLockStatus = (id: string) => {
  localStorage.setItem(id + LOCK_STATUS, id + LOCK_STATUS);
};

export const clearLockStatus = (id: string) => {
  try {
    localStorage.removeItem(id + LOCK_STATUS);
  } catch (error) { }
};

export const getLockStatus = (id: string) => {
  return !!localStorage.getItem(id + LOCK_STATUS);
};

export const LockScreen = (
  callback: Function = () => { },
  time: number,
  imidiate: boolean = false,
) => {
  let time_out = time;
  let timer: any;
  let flag = true;
  const timeCallback = () => {
    flag = false;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      flag = true;
      callback();
    }, time_out);
  };
  imidiate && timeCallback();
  registerMessage(MESSAGE_CHANNEL_LOCK, (e: any) => {
    if (flag) return;
    timeCallback();
  });
  return {
    pause: () => (flag = true),
    start: () => {
      flag = false;
      timeCallback();
    },
  };
};
