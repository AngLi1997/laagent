<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  const props = defineProps({
    icon: String,
  });

  const svgClass = computed(() => {
    if (props.icon) {
      return `svg-icon ${props.icon}`;
    }
    return 'svg-icon';
  });

  const iconName = computed(() => {
    return `#icon-${props.icon}`;
  });
</script>
<style lang="less" scoped>
  .svg-icon {
    width: 1.5rem;
    height: 1.5rem;
    vertical-align: middle;
    //   stroke:currentColor;
    fill: currentColor;
    overflow: hidden;
    display: inline-block;
    cursor: pointer;
  }
</style>
