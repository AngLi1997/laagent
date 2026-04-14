<template>
  <div :key="flowKey" class="flow-container">
    <div id="graph-container" @setting="handleClickSet" />
    <LeftToolbar
      v-if="isShowLeftToolBar"
      ref="leftToolRef"
      :is-view="isView"
      :left-map="leftMap"
      @dragstart-node="dragstartNode"
    />

    <slot name="custom" v-bind="instance" />
    <TopToolBar
      v-if="isShowTopToolBar"
      :is-view="isView"
      :show-undo="showUndo"
      :show-redo="showRedo"
      :show-reset="showReset"
      :show-zoom-in="showZoomIn"
      :show-zoom-out="showZoomOut"
      :show-delete="showDelete"
      @undo="undo"
      @redo="redo"
      @reset="reset"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @delete="deleteNode"
    />
    <BottomToolbar v-model:envs="envs" :is-view="isView" />
  </div>
</template>

<script setup lang="tsx">
import type { Cell } from '@antv/x6';
import type { BMFlowType } from './hooks';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { register } from '@antv/x6-vue-shape';
import { isEmpty } from '@bmos/utils';
import { onMounted, onUnmounted, ref, useAttrs, watch } from 'vue';
import BottomToolbar from './components/BottomToolbar.vue';
import ConditionNode from './components/ConditionNode.vue';
import EndNode from './components/EndNode.vue';
import KnowledgeBaseNode from './components/KnowledgeBaseNode.vue';
import LeftToolbar from './components/LeftToolbar.vue';
import LLMNode from './components/LLMNode.vue';
import StartNode from './components/StartNode.vue';
import SystemOutput from './components/SystemOutput.vue';
import ToolNode from './components/ToolNode.vue';
import TopToolBar from './components/TopToolBar.vue';
import UserInputNode from './components/UserInputNode.vue';
import { useEventListener } from './hooks/useEventListener';
import { createFlowContext } from './hooks/useFlowContext';
import { useFlowMethods } from './hooks/useFlowMethods';
import { useFlowState } from './hooks/useFlowState';
import { flowEmits, FlowNodeEnum, flowProps } from './type';

const props = defineProps(flowProps);
const emit = defineEmits(flowEmits);
const attrs = useAttrs();
register({
  shape: FlowNodeEnum.LLM,
  component: {
    render() {
      return (
        <LLMNode
          showTestIcon={props.showTestIcon}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.LLM)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.LLM)}
        />
      );
    },
  },
});
register({
  shape: FlowNodeEnum.TOOL,
  component: {
    render() {
      return (
        <ToolNode
          showTestIcon={props.showTestIcon}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.TOOL)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.TOOL)}
        />
      );
    },
  },
});

register({
  shape: FlowNodeEnum.KNOWLEDGE_BASE,
  component: {
    render() {
      return (
        <KnowledgeBaseNode
          showTestIcon={props.showTestIcon}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.KNOWLEDGE_BASE)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.KNOWLEDGE_BASE)}
        />
      );
    },
  },
});
register({
  shape: FlowNodeEnum.USER_INPUT,
  component: {
    render() {
      return (
        <UserInputNode
          showTestIcon={false}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.USER_INPUT)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.USER_INPUT)}
        />
      );
    },
  },
});
register({
  shape: FlowNodeEnum.OUTPUT,
  component: {
    render() {
      return (
        <SystemOutput
          showTestIcon={false}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.OUTPUT)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.OUTPUT)}
        />
      );
    },
  },
});
register({
  shape: FlowNodeEnum.CONDITION,
  component: {
    render() {
      return (
        <ConditionNode
          showTestIcon={false}
          showSetIcon={props.showSetIcon}
          showDivider={props.showDivider}
          onSetting={(cell: Cell) => handleClickSet(cell, FlowNodeEnum.CONDITION)}
          onClickTest={(cell: Cell) => handleClickTest(cell, FlowNodeEnum.CONDITION)}
        />
      );
    },
  },
});
register({
  shape: FlowNodeEnum.START,
  component: StartNode,
  width: 102,
});
register({
  shape: FlowNodeEnum.END,
  component: EndNode,
});

const graph = ref<Graph>({} as Graph);

const flowState = useFlowState({ props, attrs });
const { defaultGraphConfig, isView, fromJSON, leftToolRef, dnd, envs } = flowState;

// @ts-ignore
const flowMethods = useFlowMethods({ ...flowState, emit, graph });
const { dragstartNode, initGraph, undo, redo, reset, zoomIn, zoomOut, deleteNode, handleClickSet, handleClickTest }
    = flowMethods;

const eventListener = useEventListener({
  ...flowState,
  ...flowMethods,
  emit,
  // @ts-ignore
  graph,
  props,
});

const { setEventListener } = eventListener;

const initFn = async () => {
  await nextTick();
  const options = {
    interacting: {
      edgeMovable: !isView.value,
      edgeLabelMovable: !isView.value,
      arrowheadMovable: !isView.value,
      vertexMovable: !isView.value,
      vertexAddable: !isView.value,
      vertexDeletable: !isView.value,
      useEdgeTools: !isView.value,
      nodeMovable: true,
      magnetConnectable: !isView.value,
      stopDelegateOnDragging: !isView.value,
      toolsAddable: !isView.value,
    },
    autoResize: true,
    container: document.getElementById('graph-container')!,
    ...(defaultGraphConfig.value as Graph.Options),
    ...(isEmpty(props.connecting) ? {} : { connecting: props.connecting }),
  };
  if (graph.value.dispose) {
    graph.value?.dispose?.();
  }
  graph.value = new Graph(options) as Graph;
  initGraph();
  if (fromJSON.value && fromJSON.value.length > 0) {
    await nextTick();
    graph.value?.fromJSON(fromJSON.value);
    await nextTick();
    setTimeout(() => {
      reset();
    }, 100);
  }
  setEventListener();
  dnd.value = new Dnd({ target: graph.value as Graph });
};
const flowKey = ref(Math.random());
onMounted(async () => {
  await initFn();
});

watch(
  () => fromJSON.value,
  async (val) => {
    if (val && val.length > 0) {
      await nextTick();
      graph.value.fromJSON(val);
      await nextTick();
      setTimeout(() => {
        reset();
      }, 100);
    }
  },
  {
    deep: true,
  },
);

// 当前组件所有的状态和方法
const instance = {
  ...flowState,
  ...flowMethods,
  ...eventListener,
  graph,
  register,
} as BMFlowType & {
  register: typeof register;
  graph: Ref<Graph>;
};
createFlowContext(instance);

defineExpose(instance);

onUnmounted(() => {
  graph.value?.dispose?.();
});

onActivated(() => {
  flowKey.value = Math.random();
  initFn();
});
</script>

<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
  .graph-container {
    width: 100%;
    height: 100%;
  }
  :deep(.x6-node-selected) {
    .flow-basic-node {
      border: 1px solid var(--bmos-primary-color);
    }
    .flow-start-node {
      border: 1px solid var(--bmos-success-color);
    }
    .flow-end-node {
      border: 1px solid var(--bmos-danger-color);
    }
  }
}
</style>
