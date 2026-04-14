import { defineStore } from 'pinia';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const handleMenuList = (list: RouteRecordRaw[]) => {
  return list.filter(item => {
    if (item.children) {
      item.children = handleMenuList(item.children);
    }
    return item.meta && !item.meta.hidden;
  })
};

export const useMenuStore = defineStore('menus', () => {
  const menus = ref<any[]>([]);

  const registerMenus = (list: RouteRecordRaw[]) => {
    
    const new_list = handleMenuList(list);
    menus.value = new_list;
  };

  return { menus, registerMenus };
});
