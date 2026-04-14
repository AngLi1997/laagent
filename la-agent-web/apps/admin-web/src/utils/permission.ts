import { getPermissionMenuList } from '../api/Permissions/authorization';
import { usePermissionStore } from '../stores/permission';
import { flatMenuTreeData } from './utils';

export const buttonPermissions = (): Promise<any> => {
  return getPermissionMenuList({ rootMenuCode: 230, containsFunc: true })
    .then(({ data }) => {
      const { setPermissions } = usePermissionStore();
      setPermissions(flatMenuTreeData(data));
      return Promise.resolve();
    })
    .catch(() => {
      return Promise.reject(new Error('获取按钮权限失败'));
    });
};
