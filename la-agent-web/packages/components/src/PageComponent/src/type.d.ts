import type { TableColumn, TableInstance } from '../../index';
import { Ref } from 'vue';
export type KEY = string | number;
export type ColumnType = TableColumn[];

export type tableRowClick = (
  record: any,
  tableInstances: TableInstance,
  keys:KEY[]
) => void;

export type rowClick = (
  record: any,
  index:number,
  tableInstances: TableInstance,
  keys:KEY[]
) => void;

export type FIELD = {
  default?: Record<string, any>;
  field?: Record<string, any>;
};