import buttonProps from 'ant-design-vue/es/button/buttonTypes';
import type { ExtractPropTypes } from 'vue';
import initDefaultProps from '../../../utils/initDefaultProps';

// props 对象
export const bmButtonProps = {
  ...initDefaultProps(buttonProps(), { type: 'primary' }),
};

// props 类型
export type BMButtonProps = Partial<ExtractPropTypes<typeof bmButtonProps>>;
