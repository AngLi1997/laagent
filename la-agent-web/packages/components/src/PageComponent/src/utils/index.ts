// 根据 id 获取树中的 node
export const getNodeById = (tree: any, key: string, fieldNames: any) => {
  let node = null;
  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (item[fieldNames['key'] || 'key'] === key) {
        node = item;
      } else if (item[fieldNames['children'] || 'children']) {
        loop(item[fieldNames['children'] || 'children']);
      }
    });
  };
  loop(tree);
  return node;
};