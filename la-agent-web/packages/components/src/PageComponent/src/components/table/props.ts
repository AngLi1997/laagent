import { TableProps } from 'ant-design-vue';
import type { DataRequestFn, TableColumn } from '../../../../index';

import { PropType } from 'vue';

import { Key, RowClassName } from 'ant-design-vue/es/vc-table/interface';
import { ColumnType, FIELD, tableRowClick } from '../../type';
type rowFn = (record: TableColumn) => string | number;
type RowSelectionType = TableProps['rowSelection'];

export const tablesProps = {
  request: {
    type: Function as PropType<DataRequestFn>,
    default: () => {},
  },
  column: {
    type: Array as PropType<ColumnType>,
    default: () => [],
  },
  rowKey: {
    type: String || (Function as PropType<rowFn>),
  },
  data: Array as PropType<Array<[]>>,
  rowSelection: {
    type: Object as PropType<RowSelectionType>,
  },
  scroll: {
    type: Object as PropType<Record<string, number>>,
    default: () => ({ x: 1000, y: 220 }),
  },
  rowClick: {
    type: Function as PropType<tableRowClick>,
    default: () => {},
  },
  pagination: Object as PropType<TableProps['pagination']>,
  params: Object as PropType<Record<string, any>>,
  fields: Array as PropType<FIELD[]>,
  tableField: Object as PropType<Record<string, any>>,
  search: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  formProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      showAdvancedButton: false,
    }),
  },
  title: {
    type: String as PropType<string>,
    default: '',
  },
  showToolBar: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  showHeader: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 是否显示表格搜索下的 border */
  showSearchBorder: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  isSelect: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isMultipleSelect: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 是否显示隐藏 第二个table的功能按钮
  showHideSecondTableIcon: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 隐藏第二个table
  swipeDown: {
    type: Function,
    default: () => {},
  },
  bordered: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  rowClassName: {
    type: Function as PropType<RowClassName<any>>,
    default: () => '',
  },
  expandFixed: {
    type: String as PropType<'left' | 'right' | boolean>,
    default: 'left',
  },
  expandedRowKeys: {
    type: Array as PropType<Array<any>>,
  },
  rowExpandable: {
    type: Function as PropType<(record: any) => boolean>,
    default: () => true,
  },
  expandedRowsChange: {
    type: Function as PropType<(expandedKeys: Key[]) => void>,
    default: (_expandedKeys: Key[]) => {},
  },
  /** 额外参数改变是否立刻触发查询 */
  isExtraParamsChangeQuery: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  pageSizeChangeToFirst: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  dragSort: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};
