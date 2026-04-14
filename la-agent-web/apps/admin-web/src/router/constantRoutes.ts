export const constantRoutes = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      code: '首页',
    },
    redirect: '/home',
    component: () => import('@/pages/Main/index.vue'),
    children: [
      { path: '/home', component: () => import('../pages/Home/index.vue') },
      {
        path: '/chat',
        component: () => import('@/pages/ChatPage/index.vue'),
        meta: {
          title: '聊天界面',
          hiddenMenu: true,
        },
      },
      {
        path: '/BasicData/ModelConfig/detail',
        component: () => import('@/pages/BasicData/ModelConfig/Detail.vue'),
        meta: {
          title: '模型配置',
          code: '230010001',
          id: '230010001',
          hidden: false,
          parentPath: '/BasicData/ModelConfig',
        },
        name: 'BasicDataModelConfigDetail',
      },
      {
        path: '/BasicData/ToolConfig/detail',
        component: () => import('@/pages/BasicData/ToolConfig/Detail.vue'),
        meta: {
          title: '工具配置',
          code: '230010002',
          id: '230010002',
          hidden: false,
          parentPath: '/BasicData/ToolConfig',
        },
        name: 'BasicDataToolConfigDetail',
      },
      {
        path: '/documentManage/knowledgeBase/detail',
        component: () => import('@/pages/DocumentManage/KnowledgeBase/Detail.vue'),
        meta: {
          title: '知识库配置',
          code: '230020002',
          id: '230020002',
          hidden: false,
          parentPath: '/documentManage/knowledgeBase',
        },
        name: 'DocumentManageKnowledgeBaseDetail',
      },
      {
        path: '/documentManage/knowledgeBase/recallTest',
        component: () => import('@/pages/DocumentManage/KnowledgeBase/RecallTest.vue'),
        meta: {
          title: '知识库配置',
          code: '230020002',
          id: '230020002',
          hidden: false,
          parentPath: '/documentManage/knowledgeBase',
        },
        name: 'DocumentManageKnowledgeBaseRecallTest',
      },
      {
        path: '/documentManage/document/info',
        component: () => import('@/pages/DocumentManage/Document/components/EditDocument/index.vue'),
        meta: {
          title: '编辑文档',
          code: '230020001',
          id: '230020001',
          hidden: false,
          parentPath: '/documentManage/document',
        },
        name: 'DocumentManageDocumentInfo',
      },
      {
        path: '/AgentManage/Orchestration/Detail',
        component: () => import('@/pages/AgentManage/Orchestration/Detail.vue'),
        meta: {
          title: '新增应用',
          code: '230030001',
          id: '230030001',
          hidden: true,
          hiddenMenu: true,
          parentPath: '/AgentManage/Orchestration',
        },
        name: 'AgentManageOrchestrationDetail',
      },
      {
        path: '/ServiceMonitoring/ContentReview/CreateWordGroup',
        component: () => import('@/pages/ServiceMonitoring/ContentReview/CreateWordGroup.vue'),
        meta: {
          title: '创建词组',
          code: '230040001',
          id: '230040001',
          hidden: true,
          parentPath: '/ServiceMonitoring/ContentReview',
        },
        name: 'ServiceMonitoringContentReviewCreateWordGroup',
      },
    ],
  },
];
