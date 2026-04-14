<script lang="ts" setup>
  import { computed, onMounted, unref, useAttrs } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { bmTreeSelectProps, treeSelectEmits } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  defineOptions({
    name: 'BMTreeSelect',
  });
  const props = defineProps(bmTreeSelectProps);
  const emit = defineEmits(treeSelectEmits);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
  mountStyle('-bmos-tree-select', style);

  onMounted(() => {
    emit('register');
  });
</script>
<template>
  <TreeSelect v-bind="getBindValue">
    <template v-for="name of Object.keys($slots)" #[name]="data">
      <slot :name="name" v-bind="data || {}"></slot>
    </template>
  </TreeSelect>
</template>
