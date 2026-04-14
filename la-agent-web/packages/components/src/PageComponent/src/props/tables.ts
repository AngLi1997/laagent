import { EmptyProps, TableProps } from 'ant-design-vue';
import type { DataRequestFn, FormProps, TableColumn } from '../../../index';

import { PropType } from 'vue';

import { RowClassName } from 'ant-design-vue/es/vc-table/interface';
import { ColumnType, FIELD, rowClick } from '../type';
type rowFn = (record: TableColumn) => string | number;

export const tablesProps = {
  requests: {
    type: Array as PropType<DataRequestFn[]>,
    default: () => [],
  },
  columns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  rowKeys: {
    type: Array as PropType<Array<string | rowFn>>,
  },
  data: Array as PropType<Array<[]>>,
  scrolls: {
    type: Array as PropType<Record<string, number>[]>,
    default: () => [
      { x: 1000, y: 216 },
      { x: 1000, y: 174 },
    ],
  },
  rowClick: {
    type: Function as PropType<rowClick>,
    default: () => {},
  },
  pagination: Object as PropType<TableProps['pagination']>,
  params: Object as PropType<Record<string, any>>,
  fields: Array as PropType<FIELD[]>,
  treeField: Object as PropType<Record<string, any>>,
  search: Array || (Boolean as PropType<Array<boolean> | boolean>),
  formProps: Array as PropType<Array<Partial<FormProps>>>,
  titles: {
    type: Array as PropType<Array<string>>,
  },
  showToolBars: {
    type: Array as PropType<Array<boolean>>,
    default: () => [true, true],
  },
  showHeader: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  rowSelections: {
    type: Array as PropType<Array<any>>,
  },
  isMultipleSelects: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  isSelects: {
    type: Array as PropType<Array<boolean>>,
    default: () => [true, true],
  },
  showIndexs: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  showSearchBorders: {
    type: Array as PropType<Array<boolean>>,
    default: () => [true, true],
  },
  bordereds: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  rowClassNames: {
    type: Array as PropType<Array<RowClassName<any>>>,
    default: () => [() => '', () => ''],
  },
  paginations: {
    type: Array as PropType<Array<Object>>,
    default: () => [undefined, undefined],
  },
  expandFixeds: {
    type: Array as PropType<Array<'left' | 'right' | boolean>>,
    default: ['left', 'left'],
  },
  expandedRowKeys: {
    type: Array as PropType<Array<any>>,
    default: () => [],
  },
  rowExpandables: {
    type: Array as PropType<Array<any>>,
  },
  expandedRowsChanges: {
    type: Array as PropType<Array<any>>,
  },
  isExtraParamsChangeQuerys: {
    type: Array as PropType<Array<boolean>>,
    default: () => [true, true],
  },
  dataSources: {
    type: Array as PropType<Array<any>>,
  },
  pageSizeChangeToFirsts: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  dragSorts: {
    type: Array as PropType<Array<boolean>>,
    default: () => [false, false],
  },
  // 是否需要显示空数据
  showEmpty: {
    type: [Boolean, Object] as PropType<boolean | EmptyProps>,
    default: false,
  },
};
