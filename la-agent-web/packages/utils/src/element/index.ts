import { debounce } from '../func';

/**
 * @description Get the element's offset from the top of the page, taking into account the scroll position
 * @param containerSelector  The selector of the container element
 * @param currentSelector  The selector of the current element
 * @returns
 */
export const makeSticky = (containerSelector: string, currentSelector: string, wait = 80) => {
  const container = document.querySelector<HTMLElement>(containerSelector);
  const current = document.querySelector<HTMLElement>(currentSelector);

  if (!container || !current) {
    console.error('Container, or current element not found');
    return;
  }
  const realCurrentTop = current.getBoundingClientRect().top;
  // 判断 如果 有监听事件 就移除
  container.removeEventListener('scroll', () => {});
  container.addEventListener(
    'scroll',
    debounce(() => {
      const containerRect = container.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      if (container.scrollTop < realCurrentTop) {
        current.style.position = 'relative';
        current.style.top = '0';
      } else if (currentRect.top > containerRect.top) {
        current.style.position = 'relative';
        current.style.top = '0';
      } else {
        current.style.position = 'fixed';
        current.style.top = `${containerRect.top}px`;
      }
    }, wait),
  );
};

/**
 * @description 根据节点的id滚动到对应的节点到可视区域
 * @param id The id of the node
 * @returns
 */
export const scrollToNode = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  } else {
    const element = document.getElementsByName(id)[0];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }
};

/**
 * @description 根据节点的 name 滚动到对应的节点到可视区域
 * @param name The name of the node
 * @returns
 */
export const scrollToNodeByName = (name: string, id: string) => {
  const element = document.getElementsByName(name)[0];
  const target = document.getElementById(id);
  if (element && target) {
    target.scrollTop = element.offsetTop;
  }
};
