import { isObject } from '@bmos/utils';
import { ButtonProps } from 'ant-design-vue';
import { formProps } from 'ant-design-vue/es/form';
import type { ComponentInternalInstance, CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { EmitFn, Fn, Recordable } from '../../../common/types/index';
import initDefaultProps from '../../../utils/initDefaultProps';
import type BMForm from '../BMForm.vue';
import { ActionColOptions } from '../enums/common';
import type { ColEx } from './component';
import type { FieldMapToTime, FormSchema, RowProps } from './form';

export const aFormPropKeys = Object.keys(formProps());

// @ts-ignore
export const bmFormProps = {
  /** Ant Design vue 表单配置 */
  ...initDefaultProps(formProps(), {
    /** 默认表单配置 */
    labelAlign: 'right',
    layout: 'vertical',
    colon: false,
  }),
  /** 预置字段默认值 */
  initialValues: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  /** 表单配置规则 */
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  // 默认数据，合并进 formData
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  // 默认 row style
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  /** 栅栏Row配置 */
  rowProps: {
    type: Object as PropType<RowProps>,
    default: () => ({
      gutter: 32,
    }),
  },
  // 默认 col style
  baseColProps: {
    type: Object as PropType<Partial<ColEx>>,
    default: {
      span: ActionColOptions.SpanWithOutAdvance,
    },
  },
  /** 在INPUT组件上单击回车时，是否自动提交 */
  autoSubmitOnEnter: { type: Boolean as PropType<boolean>, default: true },
  /** 禁用表单 */
  disabled: { type: Boolean as PropType<boolean> },
  /** 表单结束后空 span 占位符 */
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0,
  },
  /**
   * 处理时间段字段
   * field: string, 字段名
   * timeList: [string, string], 时间字段名 [startTimeKey, endTimeKey]
   * format: string, 格式化，默认 YYYY-MM-DD
   */
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  /** 转化时间 */
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },
  /** 是否把 label 添加进校验信息 */
  rulesMessageJoinLabel: { type: Boolean as PropType<boolean>, default: true },
  /** 超过1行自动折叠 */
  autoAdvancedLine: {
    type: Number as PropType<number>,
    default: 1,
  },
  /** 不受折叠影响的行数 */
  alwaysShowLines: {
    type: Number as PropType<number>,
    default: 1,
  },
  /** 是否显示操作按钮 */
  showActionButtonGroup: { type: Boolean as PropType<boolean>, default: true },
  /** 操作列Col配置 */
  actionColOptions: Object as PropType<Partial<ColEx>>,
  /** 显示重置按钮 */
  showResetButton: { type: Boolean as PropType<boolean>, default: true },
  /** 重置按钮配置 */
  resetButtonOptions: Object as PropType<
    Partial<ButtonProps> & {
      text?: string;
      class?: string;
    }
  >,
  /** 显示确认按钮 */
  showSubmitButton: { type: Boolean as PropType<boolean>, default: true },
  /** 确认按钮配置 */
  submitButtonOptions: Object as PropType<
    Partial<ButtonProps> & {
      text?: string;
      class?: string;
    }
  >,
  /** 是否显示收起展开按钮 */
  showAdvancedButton: { type: Boolean as PropType<boolean>, default: false },

  /** 自定义重置函数 */
  resetFunc: Function as PropType<() => Promise<void>>,
  /** 自定义提交函数 */
  submitFunc: Function as PropType<() => Promise<void>>,

  // 操作按钮配置
  /** 是否显示更多后的 徽标数 */
  showAdvancedButtonBadge: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /** 徽标数数字 */
  advancedBadgeCount: { type: Number as PropType<number>, default: 0 },
  /** 是否使用默认的长度校验 */
  useMaxLengthRule: {
    type: Boolean,
    default: true,
  },
  /** formKey */
  formKey: { type: Number as PropType<number>, default: 0 },
  /* scrollToError 是否滑动到错误项 */
  scrollToError: { type: Boolean as PropType<boolean>, default: false },
};

export const bmFormEmits = {
  register: (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  reset: (formModel: Recordable<any>) => isObject(formModel),
  submit: (formModel: Recordable<any>) => isObject(formModel),
  advancedChange: () => true,
  formModelChange: (_formModel: Recordable<any>) => true,
};

export type BMFormEmits = typeof bmFormEmits;

export type BMFormEmitFn = EmitFn<BMFormEmits>;

export type FormProps<T = any> = Partial<ExtractPropTypes<typeof bmFormProps>> & {
  schemas: FormSchema<T>[];
};

// @ts-ignore:next-line
export type formInstance = Partial<InstanceType<typeof BMForm>>;
