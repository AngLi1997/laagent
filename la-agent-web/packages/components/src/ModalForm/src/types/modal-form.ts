import type { ButtonProps } from 'ant-design-vue';
import type { ComponentInternalInstance, ExtractPropTypes, PropType } from 'vue';
import type { EmitFn, Recordable } from '../../../common/types/index';
import type { FormProps } from '../../../Form';
import type ModalForm from '../index.vue';
import { isObject } from '@bmos/utils';
import { modalProps } from 'ant-design-vue/es/modal/Modal';
import initDefaultProps from '../../../utils/initDefaultProps';

export const aModalFormPropKeys = Object.keys(modalProps());
// props 对象
export const modalFormProps = {
  ...initDefaultProps(modalProps(), {
    wrapClassName: 'modalSizeMedium', // 'modalSizeMedium' | 'modalSizeLarge' | 'modalSizeExtraLarge'
    destroyOnClose: true,
    maskClosable: false,
  }),
  // 表单属性
  formProps: {
    type: Object as PropType<FormProps>,
    default: () =>
      ({
        showActionButtonGroup: false,
        labelWidth: 80,
        wrapperCol: { span: 24 },
        baseColProps: {
          span: 24,
        },
        rowProps: {
          gutter: 16,
        },
        layout: 'vertical',
      }) as FormProps,
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
export const defaultFormProps: FormProps = {
  showActionButtonGroup: false,
  labelWidth: 80,
  wrapperCol: { span: 24 },
  baseColProps: {
    span: 24,
  },
  rowProps: {
    gutter: 16,
  },
  layout: 'vertical',
} as FormProps;

// props 类型
export type ModalFormProps = Partial<ExtractPropTypes<typeof modalFormProps>>;

export const modalFormEmits = {
  'register': (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  'update:open': (open: boolean) => typeof open === 'boolean',
  'cancelModal': (instance: ComponentInternalInstance['exposed']) => isObject(instance),
  'okModal': (instance: any) => isObject(instance),
};
export type ModalFormEmits = typeof modalFormEmits;

export type ModalFormEmitFn = EmitFn<ModalFormEmits>;

// @ts-ignore:next-line
export type ModalFormInstance = InstanceType<typeof ModalForm>;
