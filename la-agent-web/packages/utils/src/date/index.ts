/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * @description 格式化时间
 * @param date 时间
 * @param format 格式化字符串
 * @returns {string} 格式化后的时间
 */
export function formatToDateTime(date: dayjs.Dayjs | undefined = undefined, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}
/**
 * @description 格式化日期
 * @param date 日期
 * @param format 格式化字符串
 * @returns {string} 格式化后的日期
 */
export function formatToDate(
  date: dayjs.Dayjs | number | undefined | string = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;
