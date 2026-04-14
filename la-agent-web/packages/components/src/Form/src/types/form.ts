import type { RowProps } from 'ant-design-vue';
import type { FormItemProps } from 'ant-design-vue/es/form/FormItem';
import type { NamePath, RuleObject } from 'ant-design-vue/es/form/interface';
import type { Component, HTMLAttributes, VNode } from 'vue';
import { JSX } from 'vue/jsx-runtime';
import type { Recordable } from '../../../common/types/index';
import { BMFormType } from '../hooks';
import type { formInstance } from './bm-form';
import type { ColEx, ComponentMapType, ComponentProps } from './component';

export type { RowProps };

export type FieldMapToTime = [string, [string, string], string?][];

export type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

/** 获取所有字段名 */
export type GetFieldKeys<T> = Exclude<keyof T, symbol | number>;

export interface RenderCallbackParams<T = string> {
  schema: FormSchema<T>;
  formModel: T extends string ? Recordable : Record<GetFieldKeys<T>, any>;
  field: T extends string ? string : GetFieldKeys<T>;
  values: any;
  /** 动态表单实例 */
  formInstance: BMFormType;
  /** 作用域插槽数据 */
  slotData?: Recordable;
}
/** 自定义VNode渲染器 */
export type CustomRenderFn<T = any> = (
  opt: RenderCallbackParams<T>,
) => Component | VNode | VNode[] | string | JSX.Element | Element;

export interface FormActionType {
  formModel?: Recordable;
  submit: () => Promise<void>;
  setFieldsValue: <T>(values: T) => Promise<void>;
  resetForm: () => Promise<void>;
  getFormValues: () => any;
  clearValidate: (name?: string | string[]) => Promise<void>;
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  setFormProps: (formProps: Partial<FormSchema>) => Promise<void>;
  removeSchemaByFiled: (field: string | string[]) => Promise<void>;
  appendSchemaByField: (
    schema: FormSchema,
    prefixField: string | undefined,
    first?: boolean | undefined,
  ) => Promise<void>;
  validateFields: (nameList?: NamePath[]) => Promise<any>;
  validate: (nameList?: NamePath[]) => Promise<any>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
}

export type RegisterFn = (formInstance: formInstance) => void;

/** 表单项 */
export interface FormSchema<T = string> {
  /** 字段名 */
  field: T extends string ? string : GetFieldKeys<T>;
  // Event name triggered by internal value change, default change
  changeEvent?: string;
  // Variable name bound to v-model Default value
  valueField?: string;
  // Label name
  label?: string | ((v: RenderCallbackParams<T>) => string) | CustomRenderFn<T>;
  // Auxiliary text
  subLabel?: string;
  // Help text on the right side of the text
  helpMessage?:
    | string
    | string[]
    | ((renderCallbackParams: RenderCallbackParams<T>) => string | string[])
    | CustomRenderFn<T>;
  // BaseHelp component props
  helpComponentProps?: Partial<HelpComponentProps>;
  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: string | number;
  // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  /** 表单项对应的组件，eg: Input */
  component?: ComponentMapType | CustomRenderFn<T> | ((opt: RenderCallbackParams<T>) => Component);
  /** 表单组件属性 */
  componentProps?:
    | ComponentProps
    | {
        (opt: RenderCallbackParams<T>): ComponentProps;
        requestResult: ComponentProps['requestResult'];
      };
  /** 表单组件slots，例如 a-input 的 suffix slot 可以写成：{ suffix: () => VNode } */
  componentSlots?:
    | ((opt: RenderCallbackParams<T>) => Recordable<CustomRenderFn<T>>)
    | Recordable<CustomRenderFn<T>>
    | ReturnType<CustomRenderFn>;
  // Required
  required?: boolean | ((renderCallbackParams: RenderCallbackParams<T>) => boolean);

  suffix?: string | number | ((values: RenderCallbackParams<T>) => string | number);

  // Validation rules
  rules?: Rule[];
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  /** 组件加载状态 */
  loading?: boolean;

  // Reference formModelItem
  formItemProps?: Partial<FormItemProps> & HTMLAttributes;

  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;

  /** 搜索表单项排序 */
  order?: number;
  // 默认值
  defaultValue?: any;
  isAdvanced?: boolean;
  // label 是否显示铺满
  labelFullWidth?: boolean;

  // Matching details components
  span?: number;
  /** 作用同v-show */
  vShow?: boolean | ((renderCallbackParams: RenderCallbackParams<T>) => boolean);
  /** 作用同v-if */
  vIf?: boolean | ((renderCallbackParams: RenderCallbackParams<T>) => boolean);

  // 渲染col内容需要外层包装form-item
  renderColContent?: CustomRenderFn<T>;

  // 是否需要 FormItem margin-bottom
  noFormItemMarginBottom?: boolean;

  // 不显示 label tooltip
  noLabelTip?: boolean;

  // Custom slot, in from-item
  slot?: string;

  // 自定义槽，类似renderColContent
  colSlot?: string;

  // Custom slot, in form-item
  noLabel?: boolean;

  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams<T>) => boolean);

  // form-item useMaxLengthRule
  useMaxLengthRule?: boolean;

  dynamicRules?: (renderCallbackParams: RenderCallbackParams<T>) => Rule[] | Rule;
}
export interface HelpComponentProps {
  maxWidth: string;
  // Whether to display the serial number
  showIndex: boolean;
  // Text list
  text: any;
  // colour
  color: string;
  // font size
  fontSize: string;
  icon: string;
  absolute: boolean;
  // Positioning
  position: any;
}
