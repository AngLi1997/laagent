<template>
  <div class="flow-left-toolbar">
    <div
      v-for="(item, key) in leftMap"
      :key="key"
      class="group"
      :draggable="isView ? false : true"
      @dragstart="dragstart($event, item)"
    >
      <div class="drag-icon">
        <component :is="item.icon" />
      </div>
      {{ item.title }}
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { FlowLeftToolBar } from '../type/toolBar';

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isProcedure: {
    type: Boolean,
    default: false,
  },
  leftMap: {
    type: Array as PropType<FlowLeftToolBar[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: 'dragstartNode', event: any, item: FlowLeftToolBar): void;
}>();

const leftMap = computed<FlowLeftToolBar[]>(() => {
  return props.leftMap;
});

const dragstart = (e: any, item: FlowLeftToolBar) => {
  if (props.isView)
    return;
  emit('dragstartNode', e, item);
};
</script>

<style scoped lang="less">
.flow-left-toolbar {
  width: 110px;
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  display: inline-flex;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  .group {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: grab;
    user-select: none;
  }
  .drag-icon {
    font-size: 12px;
    width: 16px;
    height: 16px;
  }
}
</style>
