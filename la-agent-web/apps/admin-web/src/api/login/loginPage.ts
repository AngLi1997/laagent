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
