import type { ExtractPropTypes, PropType } from 'vue';
import type { EmitFn } from '../../../common/types';

export enum BMStateTagEnum {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  DEFAULT = 'default',
  CONFIRM = 'confirm',
  PURPLE = 'purple',
  LIMIT = 'limit',
}
export type BMStateTagType = `${BMStateTagEnum}`;

// props 对象
export const bmStateTagProps = {
  type: {
    type: String as PropType<BMStateTagType>,
    default: 'primary',
  },
  // 能否点击
  isClick: {
    type: Boolean,
    default: false,
  },
};

export const stateTagEmits = {
  register: () => true,
  click: (_e: Event) => {},
};

export type StateTagEmits = typeof stateTagEmits;

export type StateTagEmitFn = EmitFn<StateTagEmits>;
// props 类型
export type BMStateTagProps = Partial<ExtractPropTypes<typeof bmStateTagProps>>;
