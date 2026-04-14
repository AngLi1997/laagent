<script lang="ts" setup>
  import { computed, onMounted, unref, useAttrs } from 'vue';
  import { Select } from 'ant-design-vue';
  import { bmSelectProps, selectEmits } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  defineOptions({
    name: 'BMSelect',
  });
  const props = defineProps(bmSelectProps);
  const emit = defineEmits(selectEmits);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
  mountStyle('-bmos-select', style);

  onMounted(() => {
    emit('register');
  });
</script>
<template>
  <Select v-bind="getBindValue">
    <template v-for="name of Object.keys($slots)" #[name]="data">
      <slot :name="name" v-bind="data || {}"></slot>
    </template>
  </Select>
</template>
