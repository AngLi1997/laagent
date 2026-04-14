// updateMessageCount
export enum MessageType {
  UpdateMessageCount = 'updateMessageCount',
}

/**
 * @description 发送消息到平台
 * @param {string} type 消息类型
 * @param {Record<string, any>} 消息体
 */
export const sendMessage = (type: string, data?: Record<string, any>) => {
  type && window.parent?.postMessage({ type, data }, '*');
};
