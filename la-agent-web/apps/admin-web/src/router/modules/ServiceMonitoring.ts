import type { RouteRecordRaw } from 'vue-router';

const ServiceMonitoringRouter: RouteRecordRaw = {
  path: '/ServiceMonitoring',
  redirect: '/ServiceMonitoring/QuestionShootRange',
  meta: {
    title: '服务监控',
    id: '230040',
    icon: 'AreaManagement',
  },
  children: [
    {
      path: '/ServiceMonitoring/TagTuning',
      component: () => import('@/pages/ServiceMonitoring/TagTuning/index.vue'),
      meta: { title: '标记调优', id: '230040002' },
      name: 'TagTuning',
    },
    {
      path: '/ServiceMonitoring/ContentReview',
      component: () => import('@/pages/ServiceMonitoring/ContentReview/index.vue'),
      meta: { title: '内容审查', id: '230040001' },
      name: 'ContentReview',
    },
    {
      path: '/ServiceMonitoring/QuestionShootRange',
      component: () => import('@/pages/ServiceMonitoring/QuestionShootRange/index.vue'),
      meta: { title: '问题靶场', id: '230040003' },
      name: 'QuestionShootRange',
    },
    {
      path: '/ServiceMonitoring/ChatLog',
      component: () => import('@/pages/ServiceMonitoring/ChatLog/index.vue'),
      meta: { title: '对话日志', id: '230040004' },
      name: 'ChatLog',
    },
  ],
};
export default ServiceMonitoringRouter;
