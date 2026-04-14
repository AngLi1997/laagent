<template>
  <div class="bmos-table-title">
    <span class="bmos-table-title-icon"></span>
    <span class="bmos-table-title-content">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';

  defineProps({
    title: {
      type: String as PropType<string>,
      default: '表格标题',
    },
  });

  mountStyle('-bmos-table-title', style);
</script>
