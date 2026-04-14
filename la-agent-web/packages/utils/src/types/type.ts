export type PickFromArray<T, K extends Array<keyof T>> = {
  [P in K[number]]: T[P];
};
