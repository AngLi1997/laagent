import { MMKV } from 'react-native-mmkv';

// 创建一个 MMKV 实例
const storage = new MMKV();

/**
 * 设置键值对
 * @param key 键
 * @param value 值
 */
export const setItem = (key: string, value: string | boolean | number): void => {
  if (typeof value === 'string') {
    storage.set(key, value);
  }
  else if (typeof value === 'boolean') {
    storage.set(key, value);
  }
  else if (typeof value === 'number') {
    storage.set(key, value);
  }
  else {
    throw new TypeError('Unsupported value type');
  }
};

/**
 * 获取值
 * @param key 键
 * @returns 值
 */
export const getItem = (key: string): string | boolean | number | undefined => {
  const value = storage.getString(key);
  if (value !== undefined)
    return value;

  const boolValue = storage.getBoolean(key);
  if (boolValue !== undefined)
    return boolValue;

  const numberValue = storage.getNumber(key);
  if (numberValue !== undefined)
    return numberValue;

  return undefined;
};

/**
 * 删除键值对
 * @param key 键
 */
export const removeItem = (key: string): void => {
  storage.delete(key);
};

/**
 * 检查键是否存在
 * @param key 键
 * @returns 是否存在
 */
export const containsKey = (key: string): boolean => {
  return storage.contains(key);
};
