<template>
  <span ref="ellipsisRef" class="bmos-ellipsis-container">
    <Tooltip v-if="showToolTip" ref="toolTip" v-bind="getBindValue">
      <template v-for="(_, key) in $slots" #[key]>
        <slot :name="key"></slot>
      </template>
    </Tooltip>
    <span v-else-if="equalWidth"><slot></slot></span>
    <span v-else v-bind="getSpanBindValue">
      <slot></slot>
    </span>
  </span>
</template>
<script lang="ts" setup name="BMButton">
  import { computed, ref, unref, useAttrs, watch } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { bmEllipsisProps } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { onMounted } from 'vue';
  defineOptions({
    name: 'BMEllipsis',
  });
  const props = defineProps(bmEllipsisProps);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));

  // 如果attrs 中有 class 则 添加到 class 中， 否则新建一个 class
  watch(
    () => attrs.class,
    val => {
      if (val) {
        // @ts-ignore
        getBindValue.value.class =
          // @ts-ignore
          val + props.double ? ' bmos-ellipsis-span bmos-double-ellipsis-span' : ' bmos-ellipsis-span';
      } else {
        // @ts-ignore
        getBindValue.value.class = props.double ? 'bmos-double-ellipsis-span bmos-ellipsis-span' : 'bmos-ellipsis-span';
      }
    },
    { immediate: true },
  );

  const getSpanBindValue = computed(() => {
    // @ts-ignore
    const { class: className, style: styleObj } = getBindValue.value;
    return {
      class: className,
      style: styleObj,
    };
  });

  mountStyle('-bmos-ellipsis', style);

  const showToolTip = ref<boolean>(true);
  const equalWidth = ref<boolean>(false);
  watch(
    () => props.tooltip,
    val => {
      showToolTip.value = val;
    },
    { immediate: true },
  );

  const toolTip = ref(null);
  const ellipsisRef = ref(null);
  onMounted(() => {
    // 判断ellipsisRef 是否在可视区域
    const observer = new IntersectionObserver(entries => {
      if (entries?.[0]?.intersectionRatio === 1) {
        const parentWidth = entries[0]?.target?.parentElement?.offsetWidth;
        const childWidth = entries[0]?.target?.scrollWidth;
        if (Math.floor(parentWidth) > Math.floor(childWidth + Number(props.otherWidth))) {
          showToolTip.value = false;
          equalWidth.value = false;
        } else if (Math.floor(parentWidth) === Math.floor(childWidth + Number(props.otherWidth))) {
          equalWidth.value = true;
          showToolTip.value = false;
        } else {
          showToolTip.value = props.tooltip ? true : false;
          equalWidth.value = false;
        }
      }
    });
    observer.observe(ellipsisRef.value);
  });
</script>
