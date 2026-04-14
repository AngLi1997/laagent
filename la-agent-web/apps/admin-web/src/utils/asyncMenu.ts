import type { RouteRecordRaw } from 'vue-router';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { getMenuList } from '../api';
import { asyncRoutes } from '../router';
import { flatTreeData } from './utils';

export const getMenuTreeData = (resData: any, mapRoutes: Map<string, RouteRecordRaw>): RouteRecordRaw[] => {
  if (!resData)
    return [];
  const result: any[] = [];
  const loop = (data: any) => {
    data.forEach((item: any) => {
      let route: any = {};
      if (mapRoutes.has(item.id)) {
        const router = mapRoutes.get(item.id)!;
        route = {
          ...router,
          meta: {
            ...router.meta,
            ...item,
            title: item.name,
            code: item.id,
            parentId: item.parentId,
            keepAlive: true,
          },
          title: item.name,
          children: [],
        };
      }
      else {
        if (item.isOutside === 1) {
          route = {
            path: '/outside',
            component: () => import('@/pages/Outside/index.vue'),
            name: 'outside',
            meta: {
              ...item,
              title: item.name,
              code: item.id,
              parentId: item.parentId,
            },
            title: item.name,
          };
        }
        else {
          if (item.isOutside === 1) {
            route = {
              path: '/outside',
              component: () => import('@/pages/Outside/index.vue'),
              name: 'outside',
              meta: {
                ...item,
                title: item.name,
                code: item.id,
                parentId: item.parentId,
              },
              title: item.name,
            };
          }
          else {
            route = {
              path: `/${item.id}`,
              component: () => '',
              meta: {
                parentId: item.parentId,
                title: item.name,
                id: item.id,
                code: item.id,
              },
              title: item.name,
              children: [],
            };
          }
        }
      }
      if (item.children) {
        route.children = getMenuTreeData(item.children, mapRoutes) as any;
      }
      result.push(route);
    });
  };
  loop(resData);
  return result;
};

let asyncMenus: any[];
export const getAsyncMenu = async (): Promise<RouteRecordRaw[]> => {
  const mapRoutes = flatTreeData(asyncRoutes);
  try {
    if (asyncMenus) {
      return asyncMenus;
    }
    const res = await getMenuList({ rootMenuCode: 230 });
    if (res.code === 0) {
      const data = getMenuTreeData(res.data[0]?.children, mapRoutes);
      asyncMenus = data;
      return data;
    }
    asyncMenus = asyncRoutes;
    message.warning(res.message || t('菜单接口不可用，已切换为本地菜单'));
    return asyncMenus;
  }
  catch (_error) {
    asyncMenus = asyncRoutes;
    message.warning(t('查询菜单失败，已切换为本地菜单'));
    return asyncMenus;
  }
};
