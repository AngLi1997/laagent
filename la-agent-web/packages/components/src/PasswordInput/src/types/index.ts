import { inputProps } from 'ant-design-vue/es/vc-input/inputProps';
import type { ExtractPropTypes } from 'vue';
import initDefaultProps from '../../../utils/initDefaultProps';

// props 对象
export const bmPasswordInputProps = {
  ...initDefaultProps(inputProps(), {
    type: 'text',
    autocomplete: 'off',
    allowClear: true,
  }),
};

// props 类型
export type BMPasswordInputProps = Partial<ExtractPropTypes<typeof bmPasswordInputProps>>;
