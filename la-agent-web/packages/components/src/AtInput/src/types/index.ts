import type { EmitFn, ExtractPropTypes } from 'vue';
import BMAtInput from '../index.vue';

// props 对象
export const bmAtInputProps = {
  queryOptions: {
    type: Function,
    required: true,
  },
  customClass: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  atColor: {
    type: String,
    default: '#1890ff',
  },
  height: {
    type: String,
    default: '80px',
  },
  wrap: {
    type: Boolean,
    default: true,
  },
};

export const atInputEmits = {
  atChange: (_list: { key: string; label: string }[]) => true,
};

export type AtInputEmits = typeof atInputEmits;

export type AtInputEmitFn = EmitFn<AtInputEmits>;

// props 类型
export type BMAtInputProps = Partial<ExtractPropTypes<typeof bmAtInputProps>>;

export type atInputInstance = Partial<InstanceType<typeof BMAtInput>>;
