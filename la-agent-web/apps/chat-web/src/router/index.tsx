import { sendMessage } from '@bmos/utils';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { constantRoutes } from './constantRoutes'; // 固定路由

// 创建路由实例
const router = createBrowserRouter(constantRoutes, {
  basename: import.meta.env.BASE_URL,
});

// 子组件，用于处理路由切换逻辑
const RouteHandler: React.FC = () => {
  const location = useLocation(); // 在 Router 上下文中使用
  const [routerChangeFlag, setRouterChangeFlag] = useState(false);

  useEffect(() => {
    if (routerChangeFlag) {
      sendMessage('routerChange', { fullPath: location.pathname.slice(1) });
    }
    setRouterChangeFlag(true);
  }, [location.pathname, routerChangeFlag]);

  return null; // 不渲染任何内容，仅处理逻辑
};

// 主路由组件
const RouterWrapper: React.FC = () => {
  return (
    <RouterProvider router={router}>
      <RouteHandler />
    </RouterProvider>
  );
};

// 导出路由组件
export default RouterWrapper;
