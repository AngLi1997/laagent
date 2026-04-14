import { debounce } from '@bmos/utils';
import { Ref, computed, getCurrentInstance, onBeforeUnmount, ref } from 'vue';
import type { TableProps } from '../types';

type UseScrollParams = {
  props: TableProps;
  clsPrefixRef: Ref<string> | undefined;
};

export type UseScrollType = ReturnType<typeof useScroll>;

// 获取元素到顶部距离-通用方法
export const getPositionTop = (node: HTMLElement) => {
  let top = node.offsetTop;
  let parent = node.offsetParent as HTMLElement;
  while (parent != null) {
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement;
  }
  return top; // 所有的父元素top和
};

export const useScroll = ({ props, clsPrefixRef }: UseScrollParams) => {
  const currIns = getCurrentInstance();
  const scrollY = ref<number>(400);

  const scroll = computed(() => {
    return {
      y: scrollY.value,
      ...props.scroll,
    };
  });

  const getScrollY = debounce(() => {
    if (!props.autoHeight) return;
    const compRootEl = currIns?.proxy?.$el as HTMLDivElement;
    const className = `.${clsPrefixRef ? clsPrefixRef.value : 'ant'}-table-tbody`;
    const el = compRootEl?.querySelector(className) || compRootEl?.querySelector(className);
    if (el) {
      const y = document.documentElement.offsetHeight - getPositionTop(el as HTMLDivElement);
      // 简单粗糙的实现
      const currScrollY = y - 64 - (props?.autoHeightOffset || 0);
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      scrollY.value = (currScrollY > props?.autoHeightMinHeight! ? currScrollY : props.autoHeightMinHeight) as number;
    }
  });

  setTimeout(getScrollY);
  window.addEventListener('resize', getScrollY);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', getScrollY);
  });

  return {
    scroll,
  };
};
