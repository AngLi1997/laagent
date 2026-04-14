import type { RouteRecordRaw } from 'vue-router';

const DocumentManage: RouteRecordRaw = {
  path: '/documentManage',
  redirect: '/documentManage/document',
  meta: {
    title: '知识库管理',
    id: '230020',
    icon: 'DataInstrument',
  },
  children: [
    {
      path: '/documentManage/document',
      meta: {
        title: '文档管理',
        id: '230020001',
      },
      name: 'Document',
      component: () => import('@/pages/DocumentManage/Document/index.vue'),
    },
    {
      path: '/documentManage/knowledgeBase',
      meta: {
        title: '知识库管理',
        id: '230020002',
      },
      name: 'KnowledgeBase',
      component: () => import('@/pages/DocumentManage/KnowledgeBase/index.vue'),
    },
  ],
};

export default DocumentManage;
