<template>
  <div class="bmos-at-container" @focusout="inputBlur">
    <div
      ref="atInputRef"
      :class="_class"
      :style="{
        '--bmos-at-input-height': height,
      }"
      :contenteditable="!disabled"
      spellcheck="false"
      @input="inputChange"
      @click="inputClick"
      @keydown="inputKeydown">
      <template v-html="inputValue"></template>
    </div>
    <div
      v-if="popoverIsShow"
      ref="popoverRef"
      key="popover"
      class="bmos-at-popover"
      tabindex="0"
      :style="{
        top: popoverPosition.top + 'px',
        left: popoverPosition.left + 'px',
      }">
      <div v-if="isQuerying" class="loading-tip">加载中...</div>
      <ul v-else class="bmos-at-popover-list">
        <li
          v-for="(item, index) in options"
          ref="popoverItemRef"
          :key="item.label"
          class="bmos-at-popover-item"
          :class="{ active: currentFocusOptionIndex === index }"
          @mousedown="beforeSelect"
          @click="onSelect(item)">
          {{ item.label }}
        </li>
        <li v-if="!options.length" class="empty">暂无数据</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { atInputEmits, bmAtInputProps } from './types';
  import { mountStyle } from '../../utils/cssr';
  import style from './style';

  const props = defineProps(bmAtInputProps);
  const emit = defineEmits(atInputEmits);

  // 绑定css
  mountStyle('-bmos-bmos-at-input', style);

  const atInputRef = ref();
  const popoverItemRef = ref();
  // 输入框内容
  const inputValue = defineModel<string>('inputValue', {
    default: undefined,
  });
  // @索引
  const currentAtIdx = ref(0);
  const preffix = ref<Node | string>('');
  const suffix = ref('');
  const options = ref<{ key: string | number; label: string }[]>([]);

  let timer: null | NodeJS.Timeout = null;
  let isQuerying = ref(false);
  function setOptions(key: string) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    isQuerying.value = true;
    timer = setTimeout(async () => {
      const _options = await props.queryOptions?.(key);
      isQuerying.value = false;
      options.value = _options;
      currentFocusOptionIndex.value = 0;
    }, 500);
  }

  const popoverRef = ref();
  const popoverIsShow = ref(false);
  const popoverPosition = ref({ top: 0, left: 0 });
  function inputChange(e: Event) {
    const { innerText } = e.target as HTMLElement;
    inputValue.value = innerText;
    console.log('inputChange', inputValue.value);
    onObserveInput();
  }

  const onObserveInput = (fromSpanClick: boolean = false) => {
    let cursorBeforeStr = '';
    const selection: any = window.getSelection();
    if (selection?.focusNode?.data) {
      cursorBeforeStr = selection.focusNode?.data.slice(0, selection.focusOffset);
    }
    preffix.value = selection.focusNode;
    // 当前光标所在文本节点光标前的最后一个@所在位置
    const lastAtIndex = cursorBeforeStr?.lastIndexOf('@');
    currentAtIdx.value = lastAtIndex;
    if (lastAtIndex !== -1) {
      getCursorPosition();
      // 当前光标所在文本节点光标前的最后一个@至光标的文本,若是点击@标签执行的计算，则无视光标所在偏移值,默认搜索所有值
      const searchStr = fromSpanClick ? '' : cursorBeforeStr.slice(lastAtIndex + 1);
      if (!isIncludeSpacesOrLineBreak(searchStr)) {
        suffix.value = searchStr;
        setOptions(searchStr);
        popoverIsShow.value = true;
      } else {
        popoverIsShow.value = false;
        suffix.value = '';
      }
    } else {
      popoverIsShow.value = false;
    }
  };

  function inputClick(e: MouseEvent) {
    if (props.disabled) return;
    // 判断当前标签名是否为span 是的话选中当做一个整体
    if ((e.target as HTMLElement).localName === 'span') {
      onObserveInput(true);
      selectAtSpanTag(e.target as HTMLElement);
    } else {
      onObserveInput();
    }
  }

  const selectAtSpanTag = (target: HTMLElement) => {
    window.getSelection()?.getRangeAt(0).selectNode(target);
  };

  const getCursorPosition = () => {
    // 坐标相对浏览器的坐标
    const { x, y } = window.getSelection()?.getRangeAt(0).getBoundingClientRect() as any;
    // 获取编辑器的坐标
    const { x: eX, y: eY } = atInputRef.value?.getBoundingClientRect() as any;
    // 光标所在位置
    popoverPosition.value = { left: x - eX, top: y - eY + 20 };
  };

  /**
   * @param name 标签名
   * @param color 回显颜色
   * @returns
   */
  const createAtSpanTag = (option: { key: string | number; label: string }, color = props.atColor) => {
    const ele = document.createElement('span');
    ele.className = 'bmos-at-span';
    ele.style.color = color;
    ele.contentEditable = 'false';
    ele.innerText = `@${option.label}`;
    ele.tabIndex = getAtList().length + 1;
    ele.setAttribute('data-key', option.key.toString());
    return ele;
  };

  let previousActiveNode: HTMLElement | null = null;
  /** 设置点击前选区所在的元素节点 */
  const beforeSelect = (_e: MouseEvent) => {
    previousActiveNode = document.activeElement as HTMLElement;
  };

  /**
   * 选择时回调
   */
  const onSelect = (option: { key: string | number; label: string }) => {
    const selection = window.getSelection();
    // 如果点击前选中了@标签，则将选区设置为该@标签，并替换；否则执行插入操作
    if (previousActiveNode?.classList.contains('bmos-at-span')) {
      selection?.removeAllRanges(); // 清空所有选择
      const range = document.createRange(); // 创建一个 Range 对象
      range.selectNode(previousActiveNode); // 设置 Range 包含的节点
      selection?.addRange(range);
      range.deleteContents();
      const atEle = createAtSpanTag(option);
      range.insertNode(atEle);
      range.collapse(false);
    } else {
      const range = selection?.getRangeAt(0) as Range;
      // 选中输入的 @关键字  -> @郑
      range.setStart(preffix.value as Node, currentAtIdx.value);
      range.setEnd(preffix.value as Node, currentAtIdx.value + 1 + suffix.value.length);
      // 删除输入的 @关键字
      range.deleteContents();
      // 创建元素节点
      const atEle = createAtSpanTag(option);
      // 插入元素节点
      range.insertNode(atEle);
      // 光标移动到末尾
      range.collapse(false);
    }
    // 选择用户后重新计算content
    inputValue.value = atInputRef.value?.innerText as string;
    console.log('onSelect', inputValue.value);
    // 关闭弹框
    popoverIsShow.value = false;
    // 输入框聚焦
    atInputRef.value.focus();
    options.value = [];
    emit('atChange', getAtList());
  };

  function isIncludeSpacesOrLineBreak(str: string) {
    return str.includes(' ') || str.includes('\n') || str.includes('\r');
  }

  // 失焦处理
  function inputBlur(e: FocusEvent) {
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).classList.contains('bmos-at-popover')) return;
    popoverIsShow.value = false;
    options.value = [];
  }

  // 样式聚合
  const _class = computed(() => {
    return [
      props.customClass,
      'bmos-at-input',
      { 'is-error': props.error },
      { 'is-disabled': props.disabled },
      { 'is-wrap': props.wrap },
    ];
  });

  // 按键控制
  const currentFocusOptionIndex = ref(0);
  function inputKeydown(e: KeyboardEvent) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    switch (e.key) {
      case 'Enter':
        if (popoverIsShow.value) {
          onSelect(options.value[currentFocusOptionIndex.value]);
          e.preventDefault();
          break;
        }
        !props.wrap && e.preventDefault();
        break;
      case 'ArrowUp':
        if (popoverIsShow.value) {
          currentFocusOptionIndex.value =
            +(currentFocusOptionIndex.value - 1 + options.value.length) % options.value.length;
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (popoverIsShow.value) {
          currentFocusOptionIndex.value = +(currentFocusOptionIndex.value + 1) % options.value.length;
          e.preventDefault();
        }
        break;
      case 'Backspace':
        if (!range) {
          break;
        }
        // 若删除span标签，则光标所在节点的共有祖先节点应为at-input；若选中文本中包含span标签也如此。
        if ((range.commonAncestorContainer as HTMLElement)?.classList?.contains('bmos-at-input')) {
          setTimeout(() => {
            emit('atChange', getAtList());
          }, 0);
        }
    }
  }

  // 焦点控制
  function setFocus() {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(atInputRef.value);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    atInputRef.value?.focus();
  }

  // 获取文本
  function getText() {
    return atInputRef.value?.innerText as string;
  }

  // 获取@数组
  function getAtList() {
    return Array.prototype.map.call(
      atInputRef.value?.querySelectorAll('.bmos-at-span') as NodeList,
      (v: HTMLElement) => {
        return {
          label: v.innerText.slice(1),
          key: v.getAttribute('data-key'),
        };
      },
    ) as { key: string; label: string }[];
  }

  defineExpose({
    setFocus,
    getText,
    getAtList,
  });
</script>
