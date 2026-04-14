import request from '@/services';
// 查询表格
// export const userPage = async (params: any) => {
//   const res = await request({
//     url: '/platform/user/page',
//     method: 'get',
//     params,
//   });
//   return res
// };
// 用户登录(登录按钮调用)
export const userLogin = (data: any) => {
  return request({
    url: '/agent/auth/login',
    method: 'post',
    data,
  });
};
// 修改密码(同用户管理重置密码)
export const rePassWord = (data: any) => {
  return request({
    url: '/agent/auth/change-password',
    method: 'put',
    data,
  });
};
// 修改密码成功之后调编辑接口改用户状态
export const editUser = (data: any) => {
  return request({
    url: '/platform/user/update',
    method: 'put',
    data,
  });
};

export const logout = () => {
  return request({
    url: '/agent/auth/logout',
    method: 'delete',
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
 * @description: 头像上传 /api/app/agent/configs/record
 * @param {any} data
 */

export const reqAgentConfigsRecord = (data: any) => {
  return request({
    url: `/agent/configs/record`,
    method: 'POST',
    data,
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
