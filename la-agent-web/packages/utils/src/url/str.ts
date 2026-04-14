import { objectEach } from '../object';
import { isArray, isBoolean, isDate, isNumber, isString, isUndefined } from '../types';
export const quParse = (queryString: string) => {
  const params = new URLSearchParams(queryString);
  const result: Record<any, any> = {};
  for (const [key, val] of params.entries()) {
    if (isUndefined(result[key])) {
      result[key] = val;
      continue;
    }
    if (isArray(result[key])) {
      continue;
    }
    result[key] = params.getAll(key);
  }
  return result;
};

const defaultReplacer = (val: any) => {
  if (isString(val)) return val;
  if (isNumber(val)) return String(val);
  if (isBoolean(val)) return val ? 'true' : 'false';
  if (isDate(val)) return val.toISOString();
  return null;
};

export const quStringify = (query: object, replacer = defaultReplacer) => {
  const params = new URLSearchParams();
  objectEach(query, (val, key) => {
    if (isArray(val)) {
      val.forEach(i => {
        const replaced = replacer(i);
        if (replaced === null) return;
        params.append(key.toString(), replaced);
      });
    } else {
      const replaced = replacer(val);
      if (replaced === null) return;
      params.set(key.toString(), replaced);
    }
  });
  return params.toString();
};
