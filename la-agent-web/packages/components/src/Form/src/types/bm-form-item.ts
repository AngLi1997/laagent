import { PropType } from 'vue';
import type { FormSchema } from './form';

export const bmFormItemProps = {
  formModel: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  schema: {
    type: Object as PropType<FormSchema>,
    default: () => ({}),
  },
  useMaxLengthRule: {
    type: Boolean,
    default: true,
  },
};

export type BMFormItemProps = typeof bmFormItemProps;
