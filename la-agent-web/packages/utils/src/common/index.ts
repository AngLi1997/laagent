// 获取当前ip地址
export const getIp = () => {
  // @ts-ignore
  return import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_HOST : `${window.location.origin}/`;
};

// 获取logo的对象存储地址
export const getLogoUrl = (lastPath: string) => {
  const origin = getIp();
  return `${origin}front-end/assets/logo/${window.localStorage.getItem('SYSTEM-LOGO') || 'bmos'}/${lastPath}`;
};

/**
 * @description 获取 UUID
 * @param {string} prefix 前缀
 * @returns {string} UUID
 */
export function getUUID(prefix: string = ''): string {
  return `${prefix}_${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })}`;
}

/*
  @description: 复制文本到剪切板
  @param {string} text: 需要复制的文本
  @return {Promise<void>}
*/
export const fallbackCopyTextToClipboard = async (text: string) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', text);

  input.style.top = '0';
  input.style.left = '0';
  input.style.position = 'fixed';
  // 设置index为999999，保证在最上层
  input.style.zIndex = '999999';

  document.body.appendChild(input);
  input.focus();
  input.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      return Promise.resolve();
    }
    else {
      return Promise.reject(new Error('Copy failed'));
    }
  }
  catch (err) {
    return Promise.reject(new Error(err as string));
  }
  finally {
    document.body.removeChild(input);
  }
};

/*
  @description: 复制文本到剪切板
  @param {string} text: 需要复制的文本
  @return {Promise<void>}
*/
export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text);
};
