<template>
  <svg :class="svgClass" @click="onClick">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { bmIconProps } from './types';

defineOptions({
  name: 'BMIcons',
  inheritAttrs: true,
});

const props = defineProps(bmIconProps);

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

<style lang="css" scoped>
.svg-icon {
  width: 1rem;
  height: 1rem;
  vertical-align: -0.15rem;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
}
.svg-icon:focus {
  outline: none;
}
</style>
