import Layout from './Layout.vue';
import { useMenuStore } from './store';

export const menuEvent = () => {
  const { registerMenus } = useMenuStore();
  return { registerMenus };
};

export default Layout;
