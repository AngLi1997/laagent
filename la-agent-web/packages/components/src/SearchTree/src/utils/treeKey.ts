import { DataNode } from 'ant-design-vue/es/tree';
import { FieldNames } from 'ant-design-vue/es/vc-tree/interface';
import { NodeKey } from '../types';

/** 
 * @description: 获取父节点的key
 * @param {NodeKey} key: 当前节点的key
 * @param {DataNode[]} treeData: 树数据
 */
export function getParentKey(
  key: NodeKey,
  treeData: DataNode[],
  fieldNames: Required<Omit<FieldNames, '_title'>>,
): NodeKey {
  let parentKey: NodeKey = '';
  function loop(data: DataNode[]) {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node[fieldNames.children] && node[fieldNames.children].length > 0) {
        if (
          node[fieldNames.children].some(
            (item: any) => item[fieldNames.key] === key,
          )
        ) {
          parentKey = node[fieldNames.key];
        } else {
          loop(node[fieldNames.children]);
        }
      }
    }
  }
  loop(treeData);
  return parentKey;
}

/**
 * @description: 铺平树数据
 * @param {DataNode[]} treeData: 树数据
 */
export function generateList(treeData: DataNode[], fieldNames: any) {
  let dataList: DataNode[] = [];
  function generate(data: DataNode[]) {
    if (!data) {
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node[fieldNames.key];
      if (!dataList) {
        dataList = [];
      }
      dataList.push({ key, title: node[fieldNames.title] });
      if (node[fieldNames.children]) {
        generate(node[fieldNames.children]);
      }
    }
  }
  generate(treeData);
  return dataList;
}
