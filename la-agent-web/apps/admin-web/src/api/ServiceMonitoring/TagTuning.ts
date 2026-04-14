import request from '@/services';

/**
 * @description: 分页查标记调优 /api/app/agent/conversation/tag/page
 * @param {any} params
 */
export const reqTagTuningPage = (params: any) => {
  return request({
    url: `/agent/conversation/tag/page`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 下发标记优化模型 /api/app/agent/conversation/tag/send_tags
 * @param {any} data
 */
export const reqTagTuningSendTags = (data: any) => {
  return request({
    url: `/agent/conversation/tag/send_tags`,
    method: 'POST',
    data,
  });
};
