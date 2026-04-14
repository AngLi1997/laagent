import { GetRowKey } from 'ant-design-vue/es/table/interface';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { TableState } from '.';

export const useVirtualized = ({ state }: { state: TableState }) => {
  const { tableData, getProps } = state;
  const yItemHeight = ref(44);
  //表格特有class名生成
  const virtualizedClass = ref(`y-virtualized-${generateUniqueRandomPositiveInteger()}`);

  const range = ref([0, 20]);

  //容器高度
  const screenHeight = ref(0);

  //可视区域数据长度
  const visibleCount = computed(() => Math.ceil(screenHeight.value / yItemHeight.value));

  const parentNode = ref(document.querySelector(`.mes-table-body`) as HTMLDivElement);
  const contentNode = ref(document.querySelector(`.mes-table-body table`) as HTMLDivElement);

  const placeholderWrapper = ref();

  const scrollY = ref(0);

  const currentHeight = ref(0);

  const observer = ref();

  const renderList = computed(() => {
    if (!getProps.value?.virtualScroll) {
      return tableData.value;
    }
    const [start, end] = range.value;
    return tableData.value.slice(start, Math.min(end, tableData.value.length));
  });

  //滚动触发时切割数据
  const scrollEvent = () => {
    // 性能优化一下
    window.requestAnimationFrame(() => {
      screenHeight.value = parentNode.value.clientHeight;
      const startIdx = Math.floor(parentNode.value.scrollTop / yItemHeight.value);
      const endIdx = startIdx + visibleCount.value;
      range.value = [startIdx, endIdx];
      const offset = parentNode.value.scrollTop - (parentNode.value.scrollTop % yItemHeight.value);
      contentNode.value.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  };

  const initVir = () => {
    parentNode.value = document.querySelector(`.${virtualizedClass.value} .mes-table-body`) as HTMLDivElement;
    contentNode.value = document.querySelector(`.${virtualizedClass.value} .mes-table-body table`) as HTMLDivElement;
    if (parentNode.value && contentNode.value) {
      placeholderWrapper.value = document.createElement('div');
      scrollY.value = parentNode.value.clientHeight;
      placeholderWrapper.value.style.height = yItemHeight.value * tableData.value.length - scrollY.value + 'px';
      parentNode.value.appendChild(placeholderWrapper.value);
      screenHeight.value = parentNode.value.clientHeight;
      parentNode.value.addEventListener('scroll', scrollEvent);
      observerAction();
    }
  };
  const observerAction = () => {
    observer.value = new MutationObserver(() => {
      if (currentHeight.value !== parentNode.value.clientHeight) {
        window.requestAnimationFrame(() => {
          scrollY.value = parentNode.value.clientHeight;
          let placeholderHeight = yItemHeight.value * tableData.value.length - scrollY.value;
          if (placeholderHeight < 0) {
            placeholderHeight = 0;
          }
          placeholderWrapper.value.style.height = placeholderHeight + 'px';
          currentHeight.value = parentNode.value.clientHeight;
          screenHeight.value = parentNode.value.clientHeight;
          const startIdx = Math.floor(parentNode.value.scrollTop / yItemHeight.value);
          const endIdx = startIdx + visibleCount.value;
          range.value = [startIdx, endIdx];
          //计算偏移量，让数据在可视区内
          const offset = parentNode.value.scrollTop - (parentNode.value.scrollTop % yItemHeight.value);
          contentNode.value.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
      }
    });
    observer.value.observe(parentNode.value, {
      attributes: true,
      childList: false,
      subtree: false,
    });
  };

  // 根据数据的 id 显示对应的数据，滚动到对应的位置
  const scrollTo = (rowKey: string | GetRowKey<any>) => {
    const index = tableData.value.findIndex((item: any) => item[getProps.value?.rowKey] === rowKey);
    if (index !== -1) {
      const offset = index * yItemHeight.value;
      parentNode.value.scrollTop = offset;
    }
  };

  onMounted(async () => {
    await nextTick();
    initVir();
  });

  onUnmounted(() => {
    if (parentNode.value) {
      parentNode.value.removeChild(placeholderWrapper.value);
      parentNode.value.removeEventListener('scroll', scrollEvent);
      observer.value.disconnect(); //停止监听
    }
  });

  // 数据变得时候滚动回去
  watch(
    () => [tableData.value, tableData.value.length],
    (val, length) => {
      if (val && length && parentNode.value && contentNode.value) {
        scrollY.value = parentNode.value.clientHeight;
        let placeholderHeight = yItemHeight.value * tableData.value.length - scrollY.value;
        if (placeholderHeight < 0) {
          placeholderHeight = 0;
        }
        placeholderWrapper.value.style.height = placeholderHeight + 'px';
        screenHeight.value = parentNode.value.clientHeight;
      }
    },
  );

  //随机数生成
  function generateUniqueRandomPositiveInteger() {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000); // 生成一个随机数，可以根据需求调整范围
    const uniqueRandomNumber = parseInt(timestamp.toString() + randomNumber.toString());
    return uniqueRandomNumber;
  }

  return {
    renderList,
    virtualizedClass,
    scrollTo,
  };
};
