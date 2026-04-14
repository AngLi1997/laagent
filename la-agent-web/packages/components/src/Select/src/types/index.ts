import { selectProps } from 'ant-design-vue/es/select';
import type { ExtractPropTypes } from 'vue';
import type { EmitFn } from '../../../common/types';
import initDefaultProps from '../../../utils/initDefaultProps';

// props 对象
export const bmSelectProps = {
  ...initDefaultProps(selectProps(), {
    allowClear: true,
    showSearch: true,
  }),
};

export const selectEmits = {
  register: () => true,
};

export type SelectEmits = typeof selectEmits;

export type SelectEmitFn = EmitFn<SelectEmits>;
// props 类型
export type BMSelectProps = Partial<ExtractPropTypes<typeof bmSelectProps>>;
