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
 * @description: 部门树 /api/app/platform/dept/tree-all
 */
export const getResourcePermissionTree = () => {
  return request({
    url: '/platform/dept/tree-all',
    method: 'GET',
  });
};

/**
 * @description 部门树已选择 /api/app/agent/resource/get/{resource_id}
 * @param resource_id
 */
export const getResourceGet = (resource_id: string) => {
  return request({
    url: `/agent/resource/get/${resource_id}`,
    method: 'GET',
  });
};

/**
 * @description 部门权限-部分数据  /api/app/platform/dept/partition/tree
 */
export const getPermissionPartitionTree = () => {
  return request({
    url: '/platform/dept/partition/tree',
    method: 'GET',
  });
};

/**
 * @description 根据功能权限按钮id查询用户列表  /api/app/platform/user/listByMenuId
 * @param {string} menuId 权限码
 */
export const reqPlatformUserListByMenuId = async (menuId: string) => {
  return await request({
    url: '/platform/user/listByMenuId',
    method: 'get',
    params: {
      menuId,
    },
  });
};

/**
 * @description: 文件上传 /api/app/agent/file/upload
 * @param {FormData} data
 */

export const reqAgentFileUpload = (data: FormData) => {
  return request({
    url: `/agent/file/upload`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
/**
 * @description: 获取头像 /api/app/agent/configs/user/get
 */

export const reqAgentConfigsUserGet = () => {
  return request({
    url: `/agent/configs/user/get`,
    method: 'GET',
  });
};
