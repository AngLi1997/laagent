import type { RouteRecordRaw } from 'vue-router';

const AgentManageRouter: RouteRecordRaw = {
  path: '/AgentManage',
  redirect: '/AgentManage/ToolConfig',
  meta: {
    title: '智能体管理',
    id: '230030',
    icon: 'AreaManagement',
  },
  children: [
    {
      path: '/AgentManage/Orchestration',
      component: () => import('@/pages/AgentManage/Orchestration/index.vue'),
      meta: { title: 'Agent 编排', id: '230030001' },
      name: 'Orchestration',
    },
  ],
};
export default AgentManageRouter;
