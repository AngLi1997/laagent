<template>
  <div class="paragraph-tags">
    <div v-for="(tag, index) in props.tags" :key="index" style="max-width: 100px">
      <BMEllipsis tooltip :other-width="10">
        <div class="text" style="overflow: hidden; text-overflow: ellipsis">#{{ tag }}</div>
        <template #title>{{ tag }}</template>
      </BMEllipsis>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { BMEllipsis } from '@bmos/components';

  const props = defineProps({
    tags: { type: Array as PropType<string[]>, default: () => [] },
  });
</script>

<style lang="less" scoped>
  .text {
    color: #909398;
    font-size: 12px;
  }
  .paragraph-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
  }
</style>
