import type { DefineComponent, ExtractPropTypes } from 'vue';
import BMIcons from './index.vue';
import { bmIconProps } from './types';

export * from './types/';
export { BMIcons };
export default BMIcons as unknown as DefineComponent<
  Partial<ExtractPropTypes<typeof bmIconProps>>
>;
