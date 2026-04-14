import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<any>({}); // 权限列表

  // 设置权限
  const setPermissions = (val: any) => {
    permissions.value = val;
  };

  // 根据 id 判断是否有权限
  const hasPermission = (id: string): boolean => {
    return permissions.value?.[id] ? true : false;
  };
  return { permissions, setPermissions, hasPermission };
});
