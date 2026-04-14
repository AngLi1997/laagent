import type { Location } from 'react-router-dom';
import { create } from 'zustand';
import { constantRoutes } from '../router/constantRoutes';

// 定义路由元数据类型
interface CustomMeta {
  title?: string;
  code?: string;
  hiddenMenu?: boolean;
}

// 当前路由信息类型（模仿 Vue 的 RouteLocationNormalized）
interface CurrentRoute {
  path: string;
  fullPath: string;
  query: Record<string, string | undefined>;
  params: Record<string, string>;
  meta?: CustomMeta;
  name?: string;
}

// Zustand 存储定义
interface RouteState {
  currentRoute: CurrentRoute | null;
  setCurrentRoute: (location: Location, params: Record<string, any>) => void;
}

export const useRouteStore = create<RouteState>(set => ({
  currentRoute: null,
  setCurrentRoute: (location, params) => {
    const query = Object.fromEntries(new URLSearchParams(location.search).entries());
    const findRoute = (routes: any[]): any | undefined => {
      for (const route of routes) {
        if (route.path === location.pathname)
          return route;
        if (route.children) {
          const childRoute = findRoute(route.children);
          if (childRoute)
            return childRoute;
        }
      }
    };

    const matchedRoute = findRoute(constantRoutes);

    set({
      currentRoute: {
        path: location.pathname,
        fullPath: location.pathname + location.search,
        query,
        params,
        meta: matchedRoute?.meta,
        name: matchedRoute?.name,
      },
    });
  },
}));

// 全局方法：无需 React 上下文
export const getCurrentRoute = (): CurrentRoute => {
  const store = useRouteStore.getState();
  if (!store.currentRoute) {
    throw new Error('Current route is not initialized yet.');
  }
  return store.currentRoute;
};
