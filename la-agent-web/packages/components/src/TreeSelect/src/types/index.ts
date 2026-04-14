import { treeSelectProps } from 'ant-design-vue/es/tree-select';
import type { ExtractPropTypes } from 'vue';
import type { EmitFn } from '../../../common/types';
import initDefaultProps from '../../../utils/initDefaultProps';

// props 对象
export const bmTreeSelectProps = {
  ...initDefaultProps(treeSelectProps(), {
    allowClear: true,
    showSearch: true,
    treeNodeFilterProp: 'label',
  }),
};

export const treeSelectEmits = {
  register: () => true,
};

export type TreeSelectEmits = typeof treeSelectEmits;

export type TreeSelectEmitFn = EmitFn<TreeSelectEmits>;
// props 类型
export type BMTreeSelectProps = Partial<ExtractPropTypes<typeof bmTreeSelectProps>>;
