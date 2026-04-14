import { isArray, isObject } from '../types';

/**
 * 对象遍历
 * @param obj 遍历对象
 * @param iterator 遍历回调
 */
export function objectEach<T extends object>(obj: T, iterator: (val: any, key: string) => boolean | void) {
  for (const [key, val] of Object.entries(obj)) {
    if (iterator.call(obj, val, key) === false) break;
  }
}

/**
 * 获取对象中某些属性
 * @param obj 目标对象
 * @param keys 对象键值数组
 * @returns keys中属性组成的新对象
 */
export function objectPick<T extends object>(obj: T, keys: string[]) {
  type key = {
    [k: string]: any;
  };
  const obj2: key = {} as key;
  objectEach(obj, (v, k) => {
    if (keys.includes(k)) {
      (obj2 as any)[k] = v as key[typeof k];
    }
  });
  return obj2;
}

/**
 * 对象合并
 * @param source 目标对象
 * @param other 要合并的第一个对象
 * @param args 其他要合并的对象
 * @returns 合并后的对象
 */
export function merge<T extends Record<any, any>, U extends Record<any, any>, V extends Record<any, any>>(
  source: T,
  other: U,
  ...args: V[]
): T & U & V {
  let result: any = Array.isArray(source) ? [] : {};
  for (let key in source) {
    if (isObject(source[key]) && Object.prototype.hasOwnProperty.call(other, key) && isObject(other[key])) {
      result[key] = merge(source[key], other[key]);
    } else {
      result[key] = source[key];
    }
  }
  for (let key in other) {
    if (isObject(other[key]) && !Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = merge(result[key], other[key]);
    } else if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = other[key];
    }
  }
  if (args.length > 0) {
    result = merge(result, ...(args as [any, ...any[]]));
  }

  return result;
}

/**
 * 根据path获取对象中的值
 * @param obj 目标对象
 * @param path 路径
 * @param defaultValue 默认值
 * @returns 获取到的值
 */
export function get<T extends object>(obj: T, path: string | string[], def?: any) {
  const pathArr = isArray(path) ? path : path.split('.');
  let result = obj;
  for (const p of pathArr) {
    result = Object(result)[p];
    if (result === undefined) {
      return def;
    }
  }
  return result;
}

/**
 * omit 删除对象中的某些属性
 * @param obj 目标对象
 * @param fields 要删除的属性数组
 * @returns 删除后的对象
 */
export function omit<T extends object>(obj: T, fields: Array<keyof T>) {
  const shallowCopy = { ...obj };
  for (const i of fields) {
    delete shallowCopy[i];
  }
  return shallowCopy;
}

/**
 * deepMerge
 * @param obj 目标对象
 * @param args 要合并的对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<any, any>, U extends Record<any, any>>(obj: T, target: U): T {
  let key: keyof typeof obj | keyof typeof target;
  for (key in target) {
    obj[key] = isObject(obj[key]) ? deepMerge(obj[key], target[key]) : (obj[key] = target[key as keyof U]);
  }
  return obj;
}

/**
 * 深拷贝
 * @param obj 目标对象或数组
 * @returns 拷贝后的数组 或 对象
 */
export function cloneDeep<T>(obj: any): T {
  if (isObject(obj)) {
    let newObj = {} as T;
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // @ts-ignore
        newObj[key] = cloneDeep(obj[key]);
      }
    }
    return newObj;
  } else if (isArray(obj)) {
    let newArr: any = [];
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newArr[key] = cloneDeep(obj[key]);
      }
    }
    return newArr;
  } else {
    return obj;
  }
}

/**
 * uniqBy
 * @param obj 目标数组
 * @returns 去重后的数组
 */
export function uniqBy<T>(arr: T[], key: keyof T): T[] {
  return Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {},
    ),
  );
}

/**
 * set 对象赋值
 * @param obj 目标数组
 * @param path 路径 string | string[]
 * @param value 要赋的值 any
 * @returns 去重后的数组
 */

export function set<T extends object>(obj: T, path: string | string[], value: any): T {
  if (Object(obj) !== obj) {
    return obj;
  }
  const pathArr = Array.isArray(path) ? path : [path];
  const res = pathArr.slice(0, -1).reduce((prev, cur) => {
    if (Object(prev[cur]) !== prev[cur]) {
      prev[cur] = {} as any;
    }
    return prev[cur];
  }, obj);
  res[pathArr[pathArr.length - 1] as keyof typeof res] = value;
  return obj;
}

/**
 * 递归地比较两个对象的每个属性和值
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns {boolean} 是否相等
 */

export function deepEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
    return false;
  }
  const keysA = Object.keys(obj1),
    keysB = Object.keys(obj2);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

/**
 * 对象转数组方法
 * @param obj 对象
 * @returns 数组
 */
export const objectToArray = (obj: any) => {
  return Object.keys(obj).map(key => obj[key]);
};

/**
 * 数组转对象方法
 * @param arr 数组
 * @param key key
 * @returns 对象
 */
export const arrayToObject = (arr: any[], key: string) => {
  return arr.reduce((acc, cur) => {
    acc[cur[key]] = cur;
    return acc;
  }, {});
};

/**
 * 删除对象中 value 为 null 或 undefined 的属性
 * @param obj 对象
 * @returns 新对象
 */
export const omitNil = (obj: any) => {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === null || newObj[key] === undefined) {
      delete newObj[key];
    }
  }
  return newObj;
};
/**
 * 链式获取对象属性
 * @param obj 对象
 * @param path 路径 string a.b.c
 * @returns 值
 */
export function getNestedValue(obj: any, path: string) {
  if (!obj || typeof path !== 'string') return undefined;
  const keys = path.split('.');
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}
