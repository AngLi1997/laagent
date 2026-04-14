<template>
  <div class="flow-start-node">
    <BMIcon type="Start" class="start-icon" />
    <span>{{ node.data?.label || '' }}</span>
  </div>
</template>

<script lang="tsx" setup>
import type { Node } from '@antv/x6';
import { BMIcon } from '@bmos/components';
import { inject, onMounted, ref } from 'vue';

const getNode = inject('getNode') as () => Node;

const node = ref<any>({});

onMounted(() => {
  node.value = getNode();
});
</script>

<style scoped lang="less">
  /* Your CSS code here */
.flow-start-node {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  line-height: 44px;
  padding: 0 10px;
}
.start-icon {
  color: var(--bmos-success-color);
}
</style>
