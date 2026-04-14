import request from '@/services';

/**
 * @description: 分页 /chat/log/page
 * @param {any} params
 */

export const reqChatLogPage = (params: any) => {
  return request({
    url: `/agent/chat/log/page`,
    method: 'GET',
    params,
  });
};
