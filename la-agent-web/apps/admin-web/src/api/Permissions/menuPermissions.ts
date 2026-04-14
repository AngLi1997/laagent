import request from '@/services';
import { t } from '@bmos/i18n';

// 查询菜单
export const getMenuList = async (params: any) => {
  const res = await request({
    url: '/platform/menu/auth/tree',
    method: 'get',
    params,
  });
  return res;
};

// 弹窗查询角色
export const getRoleList = async (params: any) => {
  const res = await request({
    url: '/platform/role/tree-all',
    method: 'get',
    params,
  });
  return res;
};

// 选中左侧菜单 右侧渲染角色树
export const getRoleTreeAll = async (params: any) => {
  const res = await request({
    url: '/platform/role/role-tree-all',
    method: 'get',
    params,
  });
  return res;
};

//默认选中
export const getRoleTree = async (params: any) => {
  const res = await request({
    url: '/platform/menu/relate-role-data',
    method: 'get',
    params,
  });
  return res;
};

//保存
export const postMenuSave = async (data: any) => {
  const res = await request({
    url: '/platform/menu/role/save',
    method: 'post',
    data,
  });
  return res;
};

//终端类型查询
export const getTerminalType = async (params: any) => {
  const res = await request({
    url: '/platform/menu/admin/root/list',
    method: 'get',
    params,
  });
  return res;
};

export const getTerminalMenuType = async (params: any) => {
  const res = await request({
    url: ' /platform/menu/root/list',
    method: 'get',
    params,
  });
  return res;
};

// 门户页的密码设置
export const changePassword = (data: any) => {
  return request({
    url: '/platform/user/changePassword',
    method: 'put',
    data,
  });
};
// 门户页的密码设置(0715新改)
export const changeLoginUserPassword = (data: any) => {
  return request({
    url: '/platform/user/changeLoginUserPassword',
    method: 'put',
    data,
    headers: {
      'Bmos-MenuId': '100030001',
      'Bmos-Operation': 1,
      'Bmos-Operation-Business': encodeURIComponent(t('修改密码') || ''),
    },
  });
};
// 门户页的签名密码设置
export const changeSignPassword = (data: any) => {
  return request({
    url: '/platform/signature/updateSignaturePassword',
    method: 'put',
    data,
    headers: {
      'Bmos-MenuId': '100',
      'Bmos-Operation': 1,
      'Bmos-Operation-Business': encodeURIComponent(t('签名密码设置') || ''),
    },
  });
};
// 用户管理页面的修改密码(0715新改)
export const userManagerChangePwd = (data: any) => {
  return request({
    url: '/platform/user/changePwd',
    method: 'put',
    data,
  });
};

// 获取所有参数配置(可查锁屏时间)
export const getParameter = async (code: any) => {
  const res = await request({
    url: `/platform/business/parameter/detailByCode/${code}`,
    method: 'get',
  });
  return res;
};
