import type { ExtractPropTypes, PropType } from 'vue';

// props 对象
export const bmIconProps = {
  icon: String as PropType<string>,
  onClick: Function as PropType<() => void>,
};

// props 类型
export type BMIconProps = Partial<ExtractPropTypes<typeof bmIconProps>>;
