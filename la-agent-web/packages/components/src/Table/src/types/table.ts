import { isBoolean } from '@bmos/utils';
import { tableProps } from 'ant-design-vue/es/table';
import type { GetRowKey, TablePaginationConfig } from 'ant-design-vue/es/table/interface';
import type { ExtractPropTypes, PropType } from 'vue';
import { TableListResult } from '../..';
import type { FormProps } from '../../../Form/src/types';
import type { EmitFn, Recordable } from '../../../common/types';
import initDefaultProps from '../../../utils/initDefaultProps';
import type Table from '../table.vue';
import { TableColumn } from './column';

export const bmTableProps = {
  ...initDefaultProps(tableProps(), {
    rowKey: 'id',
    bordered: false,
    scroll: { x: 1100 },
  }),
  /** 表格列配置 */
  columns: {
    type: Array as PropType<TableColumn[]>,
    // required: true,
    default: () => [],
  },
  /** 是否显示搜索表单 */
  search: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 表单属性配置 */
  formProps: {
    type: Object as PropType<Partial<FormProps>>,
    default: () => ({}),
  },
  /** 表格数据请求函数 */
  dataRequest: {
    // 获取列表数据函数API
    // type: Function,
    type: Function as PropType<DataRequestFn>,
  },
  /** 是否显示索引号 */
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 索引列属性配置 */
  indexColumnProps: {
    type: Object as PropType<Partial<TableColumn>>,
    default: () => ({}),
  },
  /** 是否显示表格工具栏 */
  showToolBar: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 是否显示表格设置 */
  showTableSetting: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 表格标题 */
  headerTitle: String as PropType<string>,
  /** 表格标题提示信息 */
  titleTooltip: String as PropType<string>,
  /** 是否显示刷新按钮 */
  showRefresh: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 表格自适应高度 */
  autoHeight: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 表格自适应高度的最小高度 */
  autoHeightMinHeight: {
    type: Number as PropType<number>,
    default: 100,
  },
  /** 表格自适应高度偏移量, 如表格外的下边距 */
  autoHeightOffset: {
    type: Number as PropType<number>,
    default: 0,
  },
  /** 自动宽度 */
  exportAutoWidth: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 是否支持选中 */
  isSelect: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 是否支持多选 */
  isMultipleSelect: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 是否显示表格搜索下的 border */
  showSearchBorder: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 额外参数改变是否立刻触发查询 */
  isExtraParamsChangeQuery: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 表格额外参数 */
  extraParams: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  /** 操作列最大按钮数， 超出用 ... 显示 */
  maxActionCount: {
    type: Number as PropType<number>,
    default: 4,
  },
  /** 切换 pageSize 是否回到第一页 */
  pageSizeChangeToFirst: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 是否开启纵向虚拟滚动 */
  virtualScroll: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 是否开启拖拽排序功能 */
  dragSort: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

/**
 * 加载表格数据的参数
 */
export type LoadDataParams = TablePaginationConfig & {
  /** 根据自己业务需求定义页码 */
  pageSize?: number;
  /** 根据自己业务需求定义页数据条数 */
  pageNum?: number;
};

/**
 * 表格数据后端排序的参数
 */
export type SortParams = {
  /** 根据自己业务需求定义排序字段 */
  orderBy: string;
  /** 根据自己业务需求定义排序规则 */
  dir: string;
};

// 请求方法
export type DataRequestFn = (
  params?: LoadDataParams,
  onChangeParams?: OnChangeCallbackParams,
) => Promise<TableListResult>;

/** 表格onChange事件回调参数 */
export type OnChangeCallbackParams = Parameters<NonNullable<TableProps['onChange']>>;

/** 表格onChange事件回调函数 */
export type OnChangeCallback = TableProps['onChange'];

/** 表格onResizeColumn事件回调参数 */
export type OnResizeColumnCallbackParams = Parameters<NonNullable<TableProps['onResizeColumn']>>;

/** 表格onResizeColumn事件回调函数 */
export type OnResizeColumnCallback = TableProps['onResizeColumn'];

export type TableProps = Partial<ExtractPropTypes<typeof bmTableProps>>;

export const tableEmits = {
  register: (_instance: any) => true,
  change: (..._rest: OnChangeCallbackParams) => true,
  resizeColumn: (..._rest: OnResizeColumnCallbackParams) => true,
  'toggle-advanced': (isAdvanced: boolean) => isBoolean(isAdvanced),
  handleClickRow: (record: any, _index: string | GetRowKey<any>, _selectedRowKeys: (string | GetRowKey<any>)[]) =>
    record,
  reset: (params: Recordable) => params,
  tableSortChange: (tableData: any) => tableData,
};

export type TableEmits = typeof tableEmits;

export type TableEmitFn = EmitFn<TableEmits>;
// @ts-ignore
export type TableInstance = InstanceType<typeof Table>;
