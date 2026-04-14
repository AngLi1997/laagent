// src/router/constantRoutes.ts
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 懒加载组件
const Main = lazy(() => import('@/pages/Main'));
const Chat = lazy(() => import('@/pages/Chat'));
const History = lazy(() => import('@/pages/History'));
const PureChat = lazy(() => import('@/pages/PureChat'));

export const constantRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Main />, // 主布局组件
    children: [
      {
        index: true, // 表示默认子路由，等价于 redirect
        element: <Navigate to="/home" replace />, // 重定向到 /home
      },
      {
        path: '/home',
        element: <Chat />,
      },
      {
        path: '/main-chat',
        element: <Chat />,
      },
      {
        path: '/history',
        element: <History />,
      },
    ],
  },
  // 纯净聊天界面
  {
    path: '/pure-chat',
    element: <PureChat />,
  },
];

export default constantRoutes;
