import request from '../../src/services';

// 用户登录(登录按钮调用)
export const userLogin = (data: any) => {
  return request({
    url: '/agent/auth/login',
    method: 'post',
    data,
  });
};
// 修改密码(同用户管理重置密码)
export const rePassWord = (data: any, token = '') => {
  return request({
    url: '/agent/auth/change-password',
    method: 'put',
    data,
    headers: {
      'bmos-access-token': token,
    },
  });
};
// 登录页未激活时修改密码
export const changePassWord = (data: any, token = '') => {
  return request({
    url: '/agent/auth/change-password',
    method: 'put',
    data,
    headers: {
      'bmos-access-token': token,
    },
  });
};
// 登录页密码过期时修改密码
export const expireUserChangePwd = (data: any, token = '') => {
  return request({
    url: '/agent/auth/change-password',
    method: 'put',
    data,
    headers: {
      'bmos-access-token': token,
    },
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
// 登出
export const logout = () => {
  return request({
    url: '/agent/auth/logout',
    method: 'delete',
  });
};
// 查系统版本号
export const getSystemVersion = (params: any) => {
  return request({
    url: '/platform/param/app/version',
    method: 'get',
    params,
  });
};
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
