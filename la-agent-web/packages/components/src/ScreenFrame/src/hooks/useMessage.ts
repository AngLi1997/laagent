import { ref } from 'vue';
import { MessageType } from '../types';

export const useMessage = () => {
  const iframeWindow = ref<HTMLIFrameElement | null>(null);

  /**
   * 初始化iframe
   * @param {string} id iframe id
   * @return {void} void
   */

  const initIframeWindow = (id: string) => {
    iframeWindow.value = document.getElementById(id) as HTMLIFrameElement;
  };

  /**
   * 发送消息
   * @param {any} args 发送给iframe的参数
   * @returns {void} void
   */
  const sendMessage = (args: any) => {
    iframeWindow.value?.contentWindow?.postMessage(
      {
        type: MessageType.SEND_MESSAGE,
        ...args,
      },
      '*',
    );
  };

  return {
    iframeWindow,
    initIframeWindow,
    sendMessage,
  };
};
