import { descriptionsProps } from 'ant-design-vue/es/descriptions';
import type { ExtractPropTypes, PropType, VNode } from 'vue';
import { JSX } from 'vue/jsx-runtime';
import initDefaultProps from '../../../utils/initDefaultProps';

export interface DescriptionsRenderCallbackParams {
  label: string | VNode | JSX.Element;
  value: string | VNode | JSX.Element;
}

export type DescriptionsItemProps = {
  labelStyle?: Record<string, any>;
  label: string | VNode | JSX.Element;
  value: string | VNode | JSX.Element;
  span?: number;
  contentStyle?: Record<string, any>;
  /** 作用同v-show */
  vShow?: boolean | ((renderCallbackParams: DescriptionsRenderCallbackParams) => boolean);
  /** 作用同v-if */
  vIf?: boolean | ((renderCallbackParams: DescriptionsRenderCallbackParams) => boolean);
};

// props 对象
export const bmDescriptionsProps = {
  ...initDefaultProps(descriptionsProps(), {}),
  list: {
    type: Array as PropType<DescriptionsItemProps[]>,
    default: () => [],
  },
  // 是否需要title
  hasTitle: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  // 是否显示底部边框
  showBottomBorder: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
};

// props 类型
export type BMDescriptionsProps = Partial<ExtractPropTypes<typeof bmDescriptionsProps>>;
