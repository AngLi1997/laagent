import { inject, provide } from 'vue';
import type { TableType } from './index';

const key = Symbol('dynamic-table');

export function createTableContext(instance: TableType) {
  provide(key, instance);
}

export function useTableContext() {
  return inject(key) as TableType;
}
