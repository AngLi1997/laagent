<template>
  <div class="bmos-page-component-container">
    <div v-if="!hideRightTree" class="bmos-left-component-tree">
      <div class="bmos-left-component-header">
        <slot
          name="treeHeader"
          v-bind="{
            current: currentNodeSelect,
            key: currentKey,
            keys: SelectedKeys,
          }"></slot>
      </div>
      <div class="bmos-left-component-content">
        <BMSearchTree
          ref="treeRef"
          v-bind="treeProps"
          v-model:expandedKeys="expandedKeys"
          :defaultSelectedKeys="['all']"
          :selectedKeys="SelectedKeys"
          @addItem="(...args) => $emit('addItem', ...args)"
          @action="(...args) => $emit('action', ...args)"
          @select="select">
          <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
            <slot :name="slotName" v-bind="slotData"></slot>
          </template>
        </BMSearchTree>
      </div>
    </div>
    <div v-if="isShowEmpty" class="bmos-right-component-content bmos-right-empty-content">
      <Empty v-bind="showEmpty"></Empty>
    </div>
    <div v-else class="bmos-right-component-content">
      <slot
        v-bind="{
          current: currentNodeSelect,
          currentKey: currentKey,
          keys: SelectedKeys,
        }"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Empty, EmptyProps } from 'ant-design-vue';
  import { computed } from 'vue';
  import { BMSearchTree, searchTreeProps } from '../../../../index';
  import { ref, PropType, watch } from 'vue';
  import { DataNode, EventDataNode } from 'ant-design-vue/es/tree';
  import { FIELD, KEY } from '../../type';
  import { isArray, isEmpty, objectPick, omit, findItemByAttr } from '@bmos/utils';
  import style from '../../style';
  import { mountStyle } from '../../../../utils/cssr';

  const emit = defineEmits(['tree-select', 'update:currentNode', 'addItem', 'action', 'update:selectedKeys']);

  const props = defineProps({
    ...searchTreeProps,
    treeField: {
      type: Object as PropType<FIELD>,
      default: () => ({}),
    },
    currentNode: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    defaultSelectedNode: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    hideRightTree: { type: Boolean as PropType<boolean>, default: false },
    showEmpty: { type: [Boolean, Object] as PropType<boolean | EmptyProps>, default: false },
  });

  const treeProps = computed(() => {
    return omit(objectPick(props, Object.keys(searchTreeProps)), ['expandedKeys']);
  });

  const currentNodeSelect = ref<Record<any, any> | undefined>({});

  const isShowEmpty = computed(() => {
    return isEmpty(currentNodeSelect.value) && props.showEmpty;
  });

  const currentKey = ref<KEY>('');
  const SelectedKeys = ref<KEY[]>(['all']);
  const select = (
    selectedKeys: KEY[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    if (selectedKeys.length === 0) return;
    emit('tree-select', selectedKeys, info);
    SelectedKeys.value = [selectedKeys[0]];
    currentKey.value = selectedKeys[0] || '';
    currentNodeSelect.value = info.node;
    emit('update:currentNode', currentNodeSelect.value);
    emit('update:selectedKeys', SelectedKeys.value);
  };
  const treeRef = ref();
  watch(
    () => props.selectedKeys,
    async val => {
      if (val !== void 0 && isArray(val) && val.length > 0) {
        SelectedKeys.value = [...val];
        if (val[0] === 'all' || val[0] === '0') {
          currentKey.value = '';
          currentNodeSelect.value = void 0;
          emit('update:currentNode', {});
        } else {
          if (treeProps.value.treeData && treeProps.value.treeData.length > 0) {
            currentKey.value = val[0];
            currentNodeSelect.value = findItemByAttr(treeProps.value.treeData, 'key', val[0]) ?? {};
            emit('update:currentNode', currentNodeSelect.value);
          }
        }
      } else {
        SelectedKeys.value = ['all'];
        currentKey.value = '';
        currentNodeSelect.value = void 0;
        emit('update:currentNode', {});
      }
    },
    { immediate: true },
  );
  watch(
    () => props.currentNode,
    val => {
      if (val !== void 0) {
        currentNodeSelect.value = val;
      }
    },
    { immediate: true },
  );
  let firstRun: boolean = true;
  watch(
    () => props.defaultSelectedNode,
    val => {
      if (val && !isEmpty(val) && firstRun) {
        const fieldNames = props.fieldNames
          ? props.fieldNames
          : {
              title: 'title',
              key: 'key',
              children: 'children',
            };
        SelectedKeys.value = [val[fieldNames.key as string]];
        currentKey.value = val[fieldNames.key as string] || '';
        currentNodeSelect.value = val;
        emit('update:currentNode', currentNodeSelect.value);
        emit('update:selectedKeys', [currentKey.value]);
        firstRun = false;
      }
    },
    { immediate: true },
  );

  const expandedKeys = ref<KEY[]>(['all']);
  watch(
    () => props.expandedKeys,
    val => {
      if (val && val.length > 0) {
        expandedKeys.value = val;
      } else {
        expandedKeys.value = ['all'];
      }
    },
    { immediate: true },
  );

  mountStyle('-bmos-page-component', style);
</script>
