import request from '@/services';

/**
 * @description: 分页 /agent/models/query
 * @param {any} data
 */

export const reqAgentModelsQuery = (data: any) => {
  return request({
    url: `/agent/models/query`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 新增 /agent/models/create
 * @param {any} data
 */
export const reqAgentModelCreate = (data: any) => {
  return request({
    url: `/agent/models/create`,
    method: 'POST',
    data,
  });
};
