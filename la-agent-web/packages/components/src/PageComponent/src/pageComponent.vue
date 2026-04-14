<template>
  <PageTree
    v-model:currentNode="currentNodeSelect"
    v-bind="treeProps"
    :hideRightTree="hideRightTree"
    :showEmpty="showEmpty"
    @addItem="() => handleTreeAction({ action: 'ADD', title: t('全部') })"
    @action="(action: ActionListItem, node: any) => handleTreeAction(action, node)"
    @tree-select="(...args) => $emit('tree-select', ...args)">
    <Right
      ref="rightRef"
      :fields="tableFields"
      :isExtraParamsChangeQuerys="$props.isExtraParamsChangeQuerys"
      :treeField="treeField"
      :requests="$props.requests"
      :dataSources="$props.dataSources"
      :columns="$props.columns"
      :search="$props.search"
      :formProps="$props.formProps"
      :titles="$props.titles"
      :rowKeys="$props.rowKeys"
      :showToolBars="$props.showToolBars"
      :showSearchBorders="$props.showSearchBorders"
      :showHeader="$props.showHeader"
      :rowClick="$props.rowClick"
      :scrolls="$props.scrolls"
      :isMultipleSelects="$props.isMultipleSelects"
      :isSelects="$props.isSelects"
      :rowSelections="$props.rowSelections"
      :showIndexs="$props.showIndexs"
      :bordereds="$props.bordereds"
      :paginations="$props.paginations"
      :expandFixeds="$props.expandFixeds"
      :expandedRowKeys="$props.expandedRowKeys"
      :rowExpandables="$props.rowExpandables"
      :expandedRowsChanges="$props.expandedRowsChanges"
      :rowClassNames="$props.rowClassNames"
      :pageSizeChangeToFirsts="$props.pageSizeChangeToFirsts"
      :dragSorts="$props.dragSorts"
      @tableChange="tableChange"
      @table-sort-change="tableSortChange"
      @reset="reset">
      <template v-for="name of Object.keys($slots)" #[name]="data">
        <slot :name="name" v-bind="{ ...data, treeNode: currentNodeSelect }"></slot>
      </template>
    </Right>
    <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
      <slot :name="slotName" v-bind="slotData"></slot>
    </template>
  </PageTree>
</template>

<script setup lang="ts">
  import Right from './right.vue';
  import { searchTreeProps, ActionListItem } from '../../index';
  import PageTree from './components/pageTree/index.vue';
  import { tablesProps } from './props/tables';
  import { ref, PropType } from 'vue';
  import { FIELD } from './type';
  import { objectPick, objectEach } from '@bmos/utils';
  import { computed } from 'vue';
  import { t } from '@bmos/i18n';

  const emit = defineEmits(['tree-select', 'tree-action', 'tableChange', 'reset', 'tableSortChange']);

  const props = defineProps({
    ...tablesProps,
    ...searchTreeProps,
    treeField: {
      type: Object as PropType<FIELD>,
      default: () => ({}),
    },
    tableFields: {
      type: Array as PropType<FIELD[]>,
      default: () => [],
    },
    isExtraParamsChangeQuerys: {
      type: Array as PropType<boolean[]>,
      default: () => [true, true],
    },
    defaultSelectedNode: {
      type: Object as PropType<Record<any, any>>,
      default: () => ({}),
    },
    hideRightTree: { type: Boolean as PropType<boolean>, default: false },
  });

  const currentNodeSelect = ref<Record<any, any>>({});

  const rightRef = ref();

  const handleTreeAction = (action: ActionListItem, node?: any) => {
    emit('tree-action', action, node);
  };
  const tableChange = (rest: any, index: number) => {
    emit('tableChange', rest, index);
  };
  const reset = (params: any) => {
    emit('reset', params);
  };
  const tableSortChange = (tableData: any, index: number) => {
    emit('tableSortChange', tableData, index);
  };

  const treeProps = computed(() => {
    return objectPick(props, [...Object.keys(searchTreeProps), 'defaultSelectedNode']);
  });

  const treeField = computed(() => {
    if (props.treeField) {
      const f = props.treeField.field;
      const obj: Record<string, any> = props.treeField.default || {};
      if (f) {
        objectEach(f, (v, k) => {
          obj[k] = currentNodeSelect.value[v];
        });
      }
      return obj;
    }
    return undefined;
  });

  // 手动设置当前节点
  const changeCurrentNode = (node: any) => {
    currentNodeSelect.value = node;
  };

  defineExpose({
    fetchData: async (index: number, params?: any) => {
      await rightRef.value?.fetchData(index, params);
    },
    fetchDataTwo: () => {
      rightRef.value?.fetchData(0, {}, true);
      rightRef.value?.fetchData(1);
    },
    getQueryFormRef: (index: number) => {
      return rightRef.value?.getQueryFormRef(index);
    },
    getTableRef: (index: number) => {
      return rightRef.value?.getTableRef(index);
    },
    changeCurrentNode,
  });
</script>
