import { RouteRecordRaw } from 'vue-router';

const OutsideRouter: RouteRecordRaw = {
  path: '/outside',
  component: () => import('@/pages/Outside/index.vue'),
  meta: { title: '外链' },
  name: 'outside',
};
export default OutsideRouter;
