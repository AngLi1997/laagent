import type { ColumnsType } from 'ant-design-vue/es/table';
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface';
import type { FormSchema } from '../../../Form';
import type { Recordable } from '../../../common/types/index';
import type { ActionItem, TableActionType } from './tableAction';

export type ColumnType<T> = ColumnsType<T>[number];

export type CustomRenderParams<T = any> = Omit<
  Parameters<NonNullable<ColumnType<T>['customRender']>>[number],
  'column'
> & { column: TableColumn<T> };

/**
 * 表格属性
 */
export type TableColumn<T = Recordable> = ColumnType<T> & {
  dataIndex?: keyof T | ColumnKeyFlagType | Omit<DataIndex, string>;
  /** 指定搜索的字段 */
  searchField?: string;
  /** 在查询表单中不展示此项 */
  hideInSearch?: boolean;
  /** 在 Table 中不展示此列 */
  hideInTable?: boolean;
  /** 传递给搜索表单 Form.Item 的配置,可以配置 rules */
  formItemProps?: Partial<FormSchema<T>>;
  /** 表头搜索组件 */
  headerSearchComponent?: string;
  /** 表头搜索组件属性 */
  headerSearchComponentProps?: Recordable;
  /** 操作列，一般用于对表格某一行数据进行操作 */
  actions?: (params: CustomRenderParams<T>, action: TableActionType) => ActionItem[];
};

export enum ColumnKeyFlag {
  ACTION = 'ACTION',
  INDEX = 'INDEX',
}
export type ColumnKeyFlagType = `${ColumnKeyFlag}`;
