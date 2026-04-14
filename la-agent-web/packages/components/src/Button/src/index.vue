<script lang="ts" setup>
  import { computed, unref, useAttrs } from 'vue';
  import { Button } from 'ant-design-vue';
  import { bmButtonProps } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  defineOptions({
    name: 'BMButton',
  });
  const props = defineProps(bmButtonProps);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
  mountStyle('-bmos-button', style);
</script>
<template>
  <Button v-bind="getBindValue">
    <template v-for="name of Object.keys($slots)" #[name]="data">
      <slot :name="name" v-bind="data || {}"></slot>
    </template>
  </Button>
</template>
