import type { ButtonProps, TooltipProps } from 'ant-design-vue/es/components';
import type { PopconfirmProps } from 'ant-design-vue/es/popconfirm';
import type { Ref } from 'vue';
import type { Fn } from '../../../common/types/index';
import type { TableMethods } from '../hooks/';
import type { CustomRenderParams } from './column';

export type ActionItem = Omit<ButtonProps, 'onClick' | 'loading'> & {
  onClick?: Fn<CustomRenderParams, any>;
  label?: string;
  color?: 'success' | 'error' | 'warning';
  loading?: Ref<ButtonProps['loading']> | ButtonProps['loading'];
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
  code?: string;
};

export type PopConfirm = PopconfirmProps & {
  title: string;
  okText?: string;
  cancelText?: string;
  onConfirm: Fn<CustomRenderParams, any>;
  onCancel?: Fn<CustomRenderParams, any>;
  icon?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight';
};

export type TableActionType = {
  /** 刷新并清空,页码也会重置，不包括搜索表单 */
  reload: TableMethods['reload'];
  /** 设置动态表格属性 */
  setProps: TableMethods['setProps'];
  /** 获取远程数据 */
  fetchData: TableMethods['fetchData'];
  /** 设置表头搜索 */
  updateHeaderSearchData: TableMethods['updateHeaderSearchData'];
};
