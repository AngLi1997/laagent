import type { ButtonProps, FormProps } from 'ant-design-vue';
import type { ComponentInternalInstance, ExtractPropTypes, PropType } from 'vue';
import type { EmitFn, Recordable } from '../../../common/types/index';
import type NormalModalForm from '../index.vue';
import { isObject } from '@bmos/utils';
import { modalProps } from 'ant-design-vue/es/modal/Modal';
import initDefaultProps from '../../../utils/initDefaultProps';

export const aNormalModalFormPropKeys = Object.keys(modalProps());
// props 对象
export const normalNormalModalFormProps: any = {
  ...initDefaultProps(modalProps(), {
    wrapClassName: 'modalSizeMedium',
    destroyOnClose: true,
    maskClosable: false,
  }),
  // 表单属性
  formProps: {
    type: Object as PropType<FormProps>,
    default: () => ({
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      colon: false,
      layout: 'vertical',
    }),
  },
  // 表单分组
  fromGroupLabel: {
    type: Array as PropType<(string | ((v: NormalModalFormInstance) => string))[]>,
    default: () => [],
  },
  // trigger 按钮属性
  triggerButtonProps: {
    type: Object as PropType<ButtonProps>,
    default: () => ({
      type: 'primary',
    }),
  },
  // trigger 按钮文本
  triggerButtonText: {
    type: String as PropType<string>,
  },
  // 获取表单数据的方法
  submit: {
    type: Function as PropType<(formValues: Recordable) => Promise<any>>,
  },
  // okButtonText 按钮文本
  okButtonText: {
    type: String as PropType<string>,
  },
  // showOkButton 是否显示确定按钮
  showOkButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // cancelButtonText 按钮文本
  cancelButtonText: {
    type: String as PropType<string>,
  },
  // showCancelButton 是否显示取消按钮
  showCancelButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 是否阻止trigger按钮的默认行为
  preventDefault: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
};

// form 默认值
export const defaultNormalModalFormProps: FormProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
  colon: false,
  layout: 'vertical',
} as FormProps;

// props 类型
export type NormalModalFormProps = Partial<ExtractPropTypes<typeof normalNormalModalFormProps>>;

export const normalNormalModalFormEmits = {
  'register': (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  'update:open': (open: boolean) => typeof open === 'boolean',
  'cancelModal': (instance: ComponentInternalInstance['exposed']) => isObject(instance),
  'okModal': (instance: any) => isObject(instance),
};
export type NormalModalFormEmits = typeof normalNormalModalFormEmits;

export type NormalModalFormEmitFn = EmitFn<NormalModalFormEmits>;

// @ts-ignore:next-line
export type NormalModalFormInstance = InstanceType<typeof NormalModalForm>;
