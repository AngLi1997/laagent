export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => {
  return Object.prototype.hasOwnProperty.call(val, key);
};

export const toTypeString = (value: unknown): string => {
  return Object.prototype.toString.call(value);
};
