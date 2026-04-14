export type ID = string;

const toString = Object.prototype.toString;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const isType =
  <T>(type: string | string[]) =>
  (obj: unknown): obj is T =>
    obj != null && (Array.isArray(type) ? type : [type]).some(t => getType(obj) === `[object ${t}]`);
export const getType = (obj: any) => Object.prototype.toString.call(obj);

export const isFn = isType<(...args: any[]) => any>(['Function', 'AsyncFunction', 'GeneratorFunction']);

export const isWindow = isType<Window>('Window');

export const isHTMLElement = (obj: any): obj is HTMLElement => {
  return obj?.['nodeName'] || obj?.['tagName'];
};

export const isArray = Array.isArray;

export const isPlainObj = isType<object>('Object');

export const isString = isType<string>('String');

export const isBoolean = isType<boolean>('Boolean');

export const isNumber = isType<number>('Number');

export const isObject = (val: unknown): val is object => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

export const isRegExp = isType<RegExp>('RegExp');

export const isValid = (val: any) => val !== null && val !== undefined;

export const isValidNumber = (val: any): val is number => !isNaN(val) && isNumber(val);

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isPlainObj(val)) {
    return Object.keys(val).length === 0;
  }

  // 判断普通变量是否为空值
  if (val === null || val === undefined) {
    return true;
  }
  if (is(val, 'Number') && isNaN(val as number)) {
    return true;
  }

  return false;
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && val instanceof Promise && [val.then, val.catch, val.finally].every(isFunction);
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isAsyncFunction(val: unknown): val is Function {
  return val instanceof AsyncFunction;
}

export function isElement(val: unknown): val is Element {
  // @ts-ignore
  return isObject(val) && !!val.tagName;
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

// 定义一个类型检查函数，判断是否是对象或数组
export function isObjectOrArray(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}

export function isUndefined(target: unknown): target is undefined {
  return typeof target === 'undefined';
}
