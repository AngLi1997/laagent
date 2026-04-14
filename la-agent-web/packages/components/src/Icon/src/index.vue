<template>
  <component
    :is="getComponent"
    :rotate="rotate"
    :spin="spin"
    :style="style"></component>
</template>
<script lang="ts" setup>
  import { CSSProperties, PropType, computed } from 'vue';
  import { isString } from '@bmos/utils';
  import { componentMap, type IconComponentMapType } from './utils/componentMap';
  import Add from './icons/Add.vue';

  defineOptions({
    name: 'BMIcon',
  });

  const props = defineProps({
    type: {
      type: String as PropType<IconComponentMapType>,
      default: 'Add',
    },
    rotate: {
      type: Number,
      default: 0,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: () => ({
        
        padding: '4px',
      }),
    },
  });

  const getComponent = computed(() => {
    const component = props.type;
    return isString(component) ? componentMap[component] : Add;
  });
</script>
