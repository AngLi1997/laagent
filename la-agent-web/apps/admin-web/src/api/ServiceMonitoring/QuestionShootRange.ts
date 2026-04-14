import request from '@/services';

/**
 * @description: 分页 /questions/query
 * @param {any} data
 */

export const reqQuestionsQuery = (data: any) => {
  return request({
    url: `/agent/questions/query`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 创建 /questions/create
 * @param {any} data
 */

export const reqQuestionsCreate = (data: any) => {
  return request({
    url: `/agent/questions/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 删除 /questions/remove
 * @param {string} id
 */

export const reqQuestionsRemove = (id: string) => {
  return request({
    url: `/agent/questions/remove`,
    method: 'DELETE',
    data: { id },
  });
};

/**
 * @description: 更新 /questions/update
 * @param {any} data
 */
export const reqQuestionsUpdate = (data: any) => {
  return request({
    url: `/agent/questions/update`,
    method: 'PUT',
    data,
  });
};
