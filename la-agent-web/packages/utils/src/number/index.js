import BigNumber from 'bignumber.js';

/**
 * @description Add two numbers
 * @param a The first number 可能是一个数字 或者一个字符串 或者 undefined
 * @param b The second number 可能是一个数字 或者一个字符串 或者 undefined
 * @returns {string} The sum of the two numbers
 */
export function addNumber(a, b) {
  return new BigNumber(a).plus(b).toString();
}

/**
 * @description Subtract two numbers (a - b)
 * @param a The first number 可能是一个数字 或者一个字符串 或者 undefined
 * @param b The second number 可能是一个数字 或者一个字符串 或者 undefined
 * @returns {string} The difference of the two numbers
 */
export function subtractNumber(a, b) {
  return new BigNumber(a).minus(b).toString();
}

/**
 * @description 判断大小 a > b 返回 true 否则返回 false
 * @param a The first number 可能是一个数字 或者一个字符串 或者 undefined
 * @param b The second number 可能是一个数字 或者一个字符串 或者 undefined
 * @returns {boolean} a > b
 */
export function gtNumber(a, b) {
  return new BigNumber(a).gt(b);
}

/**
 * @description 判断大小 a < b 返回 true 否则返回 false
 * @param a The first number 可能是一个数字 或者一个字符串 或者 undefined
 * @param b The second number 可能是一个数字 或者一个字符串 或者 undefined
 * @returns {boolean} a < b
 */
export function ltNumber(a, b) {
  return new BigNumber(a).lt(b);
}
