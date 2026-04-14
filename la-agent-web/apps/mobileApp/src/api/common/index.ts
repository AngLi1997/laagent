import request from '@/services';
// 获取i18n
export const getI18nConfig = () => {
  return request({
    url: '/platform/i18n/config',
    method: 'GET',
    headers: {
      'request-resource': 'frontend-web',
    },
  });
};

/**
 * @description: 保存数据权限 /api/app/agent/resource/create
 * @param {API.StepConfigListReq} params
 */

export const reqAgentResourceCreate = (data: any) => {
  return request({
    url: `/agent/resource/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description 查询参数配置  /api/app/platform/business/parameter/detailByCode/{code}
 * @param {string} code
 */
export const getParameterDetailByCode = (code: string) => {
  return request({
    url: `/platform/business/parameter/detailByCode/${code}`,
    method: 'GET',
  });
};

/**
 * @description: 部门树 /api/app/mes/resource/permission/dept/tree
 * @param params
 */
export const getResourcePermissionTree = (params?: any) => {
  return request({
    url: '/mes/resource/permission/dept/tree',
    method: 'GET',
    params,
  });
};

/**
 * @description 部门权限-部分数据  /api/app/mes/resource/permission/partition/tree
 */
export const getPermissionPartitionTree = () => {
  return request({
    url: '/mes/resource/permission/partition/tree',
    method: 'GET',
  });
};
