import request from '@/services';

export const getPermissionMenuList = async (params: any) => {
  const res = await request({
    url: '/platform/menu/auth/all',
    method: 'get',
    params,
  });
  return res;
};

export const getRoleAddTreeAll = async (params: any) => {
  const res = await request({
    url: '/platform/role/auth/role/tree',
    method: 'get',
    params,
  });
  return res;
};

export const getPerrmissionRoleTreeAll = async (params: any) => {
  const res = await request({
    url: '/platform/role/auth/role/tree',
    method: 'get',
    params,
  });
  return res;
};
export const getPerrmissionRoleTreeAll2 = async (params: any) => {
  const res = await request({
    url: '/platform/menu/role/tree;',
    method: 'get',
    params,
  });
  return res;
};

// 默认选中
export const getPermissionRoleTree = async (params: any) => {
  const res = await request({
    url: '/platform/role/auth/list',
    method: 'get',
    params,
  });
  return res;
};

export const postPermissionMenuSave = async (data: any) => {
  const res = await request({
    url: '/platform/menu/auth/role/save',
    method: 'post',
    data,
  });
  return res;
};

// 权限授权用admin/tree可查全部功能按钮
export const getPermissionMenuList2 = async (params: any) => {
  const res = await request({
    url: '/platform/menu/admin/tree',
    method: 'get',
    params,
  });
  return res;
};
