import type {
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RadioProps,
  RateProps,
  SelectProps,
  SliderProps,
  SwitchProps,
  TimePickerProps,
  TreeProps,
  TreeSelectProps,
  UploadProps,
} from 'ant-design-vue';
import { dividerProps } from 'ant-design-vue/es/divider';
import type { CSSProperties, WatchOptions } from 'vue';
import { PromiseFn, UnionToIntersection } from '../../../common/types/index';
import type { RenderCallbackParams } from './form';

export type { ComponentMapType } from '../utils/componentMap';

type ColSpanType = number | string;

/** 组件异步请求配置 */
type RequestConfig =
  | PromiseFn<RenderCallbackParams, any>
  | {
      /** 指定监听的字段名, 当该字段值发生变化时会调用 callback */
      watchFields: string[];
      callback: PromiseFn<RenderCallbackParams, any>;
      options?: WatchOptions;
      /** debounce 请求防抖 */
      wait?: number;
    };

/** 组件属性 */
export type ComponentProps = (
  | InputProps
  | InputNumberProps
  | SelectProps
  | CascaderProps
  | SwitchProps
  | RateProps
  | DividerProps
  | TimePickerProps
  | TreeProps
  | TreeSelectProps
  | RadioGroupProps
  | RadioProps
  | UploadProps
  | DatePickerProps
  | CheckboxProps
  | SliderProps
) & {
  /** 组件异步请求数据 */
  request?: RequestConfig;
  /** 组件异步请求数据结果 */
  requestResult?: any;
  style?: CSSProperties;
  /** 手动指定v-model绑定的key */
  vModelKey?: string;
  [key: string]: any;
};

/** 所有组件属性集合 */
export type AllComponentProps = UnionToIntersection<ComponentProps>;

export const aDividerPropKeys = Object.keys(dividerProps());
export interface ColEx {
  style?: any;
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}
