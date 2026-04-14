import type { RouteRecordRaw } from 'vue-router';

const BasicDataRouter: RouteRecordRaw = {
  path: '/BasicData',
  redirect: '/BasicData/ToolConfig',
  meta: {
    title: '基础数据',
    id: '230010',
    icon: 'AreaManagement',
  },
  children: [
    {
      path: '/BasicData/ModelConfig',
      component: () => import('@/pages/BasicData/ModelConfig/index.vue'),
      meta: { title: '模型配置', id: '230010001' },
      name: 'ModelConfig',
    },
    {
      path: '/BasicData/ToolConfig',
      component: () => import('@/pages/BasicData/ToolConfig/index.vue'),
      meta: { title: '工具配置', id: '230010002' },
      name: 'ToolConfig',
    },
  ],
};
export default BasicDataRouter;
