import { RouteRecordRaw } from 'vue-router';
// 根据 id 获取 树形数据中的某个节点，返回该节点的所有信息，如果没有找到，返回 null
export const getNodeById = (id: string, treeData: any) => {
  let result = null;
  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (item.id === id) {
        result = item;
      } else if (item.children) {
        loop(item.children);
      }
    });
  };
  loop(treeData);
  return result;
};

// routerData: [{meta: {id: '1'}, children: [{meta: {id: '1-1'}}]}, {meta: {id: '2'}}, {meta: {id: '3'}}]
// 返回: [{meta: {id: '1'}} {meta: {id: '1-1'}}, {meta: {id: '2'}}, {meta: {id: '3'}}]
// 传入 routerData, 平级化树形结构数据
export const flatTreeData = (routerData: RouteRecordRaw[]) => {
  const res = new Map();
  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (item.children) {
        loop(item.children);
      }
      if (item?.meta?.id) {
        res.set(item?.meta?.id, {
          ...item,
          children: [],
        });
      }
    });
  };
  loop(routerData);
  return res;
};

// routerData: [{meta: {id: '1'}}, {meta: {id: '2', parentId: '1'}}, {meta: {id: '3', parentId: '1'}}]
// 返回: [{meta: {id: '1'}, children: [{meta: {id: '2'}}, {meta: {id: '3'}}]}]
// 传入 routerData, 根据 parentId 字段，返回树形结构数据
export const treeData = (routerData: any) => {
  const res: any[] = [];
  const loop = (data: any) => {
    data.forEach((item: any) => {
      let parent = data.find((parentItem: any) => parentItem.meta.id === item.meta.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        res.push(item);
      }
    });
  };
  loop(routerData);
  return res;
};

// routerData: [{meta: {id: '1'}}, {meta: {id: '2'}}, {meta: {id: '3'}}]
// resData: [{id: '1', children: [{id: '2', children: [{id: '3'}]}]}]
// 一个数组数据 routerData 中的 meta：{id: {id}}字段 根据 另一个树形结构数据 resData 的 id 相对于 筛选出符合条件的节点，返回树形结构的筛选后的 routerData
export const filterTreeData = (routerData: any[], resData: any) => {
  let result: any[] = [];
  const loop = (data: any) => {
    data.forEach((item: any) => {
      let router = routerData.find((routerItem: any) => routerItem.meta.id === item.id);
      if (router) {
        result.push({
          ...router,
          meta: {
            ...router.meta,
            parentId: item.parentId,
          },
          title: item.name,
          children: [],
        });
      } else {
        result.push({
          path: `/${item.id}`,
          component: () => '',
          meta: {
            parentId: item.parentId,
            title: item.name,
            id: item.id,
          },
          title: item.name,
          children: [],
        });
      }
      if (item.children) {
        loop(item.children);
      }
    });
  };
  loop(resData);
  return treeData(result);
};

export function isJSONStr(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// 传入一个对象，返回一个对象，该对象的值不为 null 或者 undefined ''
export function filterEmpty(obj: any) {
  const res: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      res[key] = obj[key];
    }
  });
  return res;
}

// treeData: [{meta: {id: '1'}, children: [{meta: {id: '1-1'}}]}, {meta: {id: '2'}}, {meta: {id: '3'}}]
// 返回: [{meta: {id: '1'}} {meta: {id: '1-1'}}, {meta: {id: '2'}}, {meta: {id: '3'}}]
// 传入 treeData, 平级化树形结构数据
export const flatMenuTreeData = (treeData: any[]) => {
  const res: any = {};
  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (item.children) {
        loop(item.children);
      }
      if (item?.id) {
        res[item?.id] = {
          ...item,
          children: [],
        };
      }
    });
  };
  loop(treeData);
  return res;
};
