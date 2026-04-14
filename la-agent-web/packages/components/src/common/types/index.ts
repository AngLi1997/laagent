import { EmitsOptions, SetupContext } from 'vue';

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Recordable<T = any> = Record<string, T>;

export type Key = string | number;

export type EmitFn<E = EmitsOptions> = SetupContext<E>['emit'];

export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export enum LogoBackgroundMode {
  // 白色
  WHITE,
  // 蓝色
  BLUE,
}
