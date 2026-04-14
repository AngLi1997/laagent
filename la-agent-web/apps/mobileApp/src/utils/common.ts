/**
 * @description 函数节流
 * @param fn 要执行的函数
 * @param wait 延迟时间
 * @param immediate 是否立即执行
 * @returns {Function}
 */
export function throttle<T extends Function>(fn: T, wait = 300, immediate = false): T {
  let timer: any = null;
  let callNow = immediate;
  return function (this: any, ...args: any[]) {
    if (callNow) {
      fn.apply(this, args);
      callNow = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  } as any;
}

/**
 * @description 函数防抖
 * @param fn 要执行的函数
 * @param wait 延迟时间
 * @param immediate 是否立即执行
 * @returns {Function}
 */
export function debounce<T extends Function>(fn: T, wait = 80, immediate = false): T {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    const callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, wait);
    if (callNow) {
      fn.apply(this, args);
    }
  } as any;
}
