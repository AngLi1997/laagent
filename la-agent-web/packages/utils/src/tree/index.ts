import { getNestedValue } from '../object';

/**
 * 树形数据， 更具传入的属性以及属性值，找到对应的item
 * @param arr 树形数据
 * @param attr 参数
 * @param value 值
 * @param children 子节点属性 默认为children
 * @returns item
 */
export function findItemByAttr<T extends Record<string, any>>(
  arr: T[],
  attr: string,
  value: any,
  children = 'children',
): T | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (getNestedValue(arr[i], attr) === value) {
      return arr[i];
    }
    if (arr[i][children]) {
      const result = findItemByAttr(arr[i][children], attr, value);
      if (result) {
        return result as T;
      }
    }
  }
  return undefined;
}
/**
 * 树形数据， 更具传入的属性以及属性值，禁止选择， 等于value的不可选择
 * @param arr 树形数据
 * @param attr 参数
 * @param value 值
 * @returns item
 */
export function loopSelectableTree<T extends Record<string, any>>(arr: T[], attr: string, value: any): T[] {
  return arr.map((item: any) => {
    if (getNestedValue(item, attr) === value) {
      item.selectable = false;
    }
    else {
      item.selectable = true;
    }
    if (item.children) {
      loopSelectableTree(item.children, attr, value);
    }
    return item;
  });
}

/**
 * 树形数据， 更具传入的属性以及属性值，禁止选择, 不等于value的不可选择
 * @param arr 树形数据
 * @param attr 参数
 * @param value 值
 * @returns item
 */
export function loopSelectableNotValueTree<T extends Record<string, any>>(arr: T[], attr: string, value: any): T[] {
  return arr.map((item: any) => {
    if (getNestedValue(item, attr) !== value) {
      item.selectable = false;
    }
    else {
      item.selectable = true;
    }
    if (item.children) {
      loopSelectableNotValueTree(item.children, attr, value);
    }
    return item;
  });
}

/**
 * 树形数据， 更具传入的属性，有 attr 字段可以选择，其他不能选择
 * @param arr 树形数据
 * @param attr 参数
 * @returns item
 */
export function loopSelectableTreeByAttr<T extends Record<string, any>>(arr: T[], attr: string): T[] {
  return arr.map((item: any) => {
    if (getNestedValue(item, attr)) {
      item.selectable = true;
    }
    else {
      item.selectable = false;
    }
    if (item.children) {
      loopSelectableTreeByAttr(item.children, attr);
    }
    return item;
  });
}

/**
 * 树形数据， 只有叶子节点才可以被选中
 * @param arr 树形数据
 * @param { string } childrenAttr 参数 默认为children
 * @returns 树形数据
 */
export function loopSelectableLeafTree<T extends Record<string, any>>(arr: T[], childrenAttr = 'children'): T[] {
  const loop = (arr: T[]) => {
    return arr.map((item: any) => {
      if (item[childrenAttr]) {
        item.selectable = false;
        loop(item[childrenAttr]);
      }
      else {
        item.selectable = true;
      }
      return item;
    });
  };
  return arr.map((item: any) => {
    item.selectable = false;
    if (item[childrenAttr]) {
      loop(item[childrenAttr]);
    }
    return item;
  });
}
