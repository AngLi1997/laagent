import request from '@/services';

/**
 * @description: 分页查询内容审查 /agent/chat/review/page
 * @param {any} params
 */
export const reqChatReviewPage = (params: any) => {
  return request({
    url: `/agent/chat/review/page`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 停/启用 /api/app/agent/chat/review/operate/{chat_review_id}
 * @param {string} chat_review_id
 * @param {boolean} enable
 */
export const reqChatReviewOperate = (chat_review_id: string, enable: boolean) => {
  return request({
    url: `/agent/chat/review/operate/${chat_review_id}`,
    method: 'PUT',
    data: {
      enable,
    },
  });
};

/**
 * @description: 详情 /api/app/agent/chat/review/detail/{chat_review_id}
 * @param {string} chat_review_id
 */
export const reqChatReviewDetail = (chat_review_id: string) => {
  return request({
    url: `/agent/chat/review/detail/${chat_review_id}`,
    method: 'GET',
  });
};

/**
 * @description: 创建内容审查 /api/app/agent/chat/review/create
 * @param {any} data
 */
export const reqChatReviewCreate = (data: any) => {
  return request({
    url: `/agent/chat/review/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 编辑内容审查 /api/app/agent/chat/review/update
 * @param {any} data
 */
export const reqChatReviewUpdate = (data: any) => {
  return request({
    url: `/agent/chat/review/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除内容审查 /api/app/agent/chat/review/delete/{chat_review_id}
 * @param {string} chat_review_id
 */
export const reqChatReviewDelete = (chat_review_id: string) => {
  return request({
    url: `/agent/chat/review/delete/${chat_review_id}`,
    method: 'DELETE',
  });
};

/**
 * @description: 拦截记录分页 /api/app/agent/chat/review/interception/record/{chat_review_id}
 * @param {any} params
 */
export const reqChatReviewInterceptionRecord = (params: any) => {
  return request({
    url: `/agent/chat/review/interception/record/${params.chat_review_id}`,
    method: 'GET',
    params,
  });
};
