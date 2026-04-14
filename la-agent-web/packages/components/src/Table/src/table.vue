<template>
  <div :key="tableKey" class="bmos-table">
    <BMForm
      v-if="search"
      ref="queryFormRef"
      submit-on-reset
      :class="[
        props.showSearchBorder ? 'bmos-table-form-border' : '',
        !props.showToolBar && props.showSearchBorder ? 'has-margin-bottom' : '',
      ]"
      v-bind="getFormProps"
      :table-instance="tableAction"
      @toggle-advanced="e => $emit('toggle-advanced', e)"
      @submit="handleSubmit"
      @reset="handleReset">
      <template v-for="item of getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BMForm>
    <div :class="['bmos-table-container', props.virtualScroll ? virtualizedClass : '']">
      <ToolBar
        v-if="showToolBar"
        :title="headerTitle"
        :title-tooltip="titleTooltip"
        :table-instance="tableAction"
        :showRefresh="showRefresh">
        <template v-for="name of Object.keys($slots)" #[name]="data">
          <slot :name="name" v-bind="data || {}"></slot>
        </template>
      </ToolBar>
      <Table
        ref="tableRef"
        v-bind="getBindValues"
        :columns="innerColumns"
        :data-source="renderList"
        @resize-column="handleResizeColumn"
        @change="handleTableChange">
        <template #customFilterIcon="{ column }">
          <BMIcon
            :type="column.headerSearchIcon || 'Search'"
            :style="{
              color: headerSearchDataRef[column.dataIndex] ? 'var(--bmos-primary-color)' : '#6C7380',
            }"></BMIcon>
        </template>
        <template v-if="!($slots.expandColumnTitle || $slots.expandedRowRender)" #headerCell="{ column }">
          <span
            :style="{
              color: headerSearchDataRef[column.dataIndex] ? 'var(--bmos-primary-color)' : undefined,
            }">
            {{ column.title }}
          </span>
        </template>
        <template #customFilterDropdown="{ confirm, column }">
          <InputSearch
            v-if="column.headerSearchComponent === 'Input'"
            ref="headerSearchInputRef"
            v-model:value="headerSearchDataRef[column.dataIndex]"
            :column="column"
            @search="tableHeaderSearch(confirm)"
            @reset="tableHeaderSearch(confirm)"></InputSearch>
          <CheckboxSearch
            v-if="column.headerSearchComponent === 'Checkbox'"
            v-model:value="headerSearchDataRef[column.dataIndex]"
            :column="column"
            @search="tableHeaderSearch(confirm)"
            @reset="tableHeaderSearch(confirm)"></CheckboxSearch>
        </template>
        <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
          <slot :name="slotName" v-bind="slotData"></slot>
        </template>
        <template #bodyCell="slotData">
          <slot name="bodyCell" v-bind="slotData"></slot>
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { useSlots, watch, onUnmounted, toRefs, onActivated, onMounted } from 'vue';
  import BMIcon from '../../Icon';
  import InputSearch from './components/headerSearchComponents/InputSearch.vue';
  import CheckboxSearch from './components/headerSearchComponents/CheckboxSearch.vue';
  import { Table } from 'ant-design-vue';
  import {
    useTableMethods,
    createTableContext,
    useTableForm,
    useTableState,
    useColumns,
    useTableHeaderSearch,
    useVirtualized,
  } from './hooks';
  import { ToolBar } from './components';
  import { bmTableProps, tableEmits } from './types';
  import type { TableActionType } from './types';
  import { BMForm } from '../../Form';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { deepEqual, isObject } from '@bmos/utils';

  defineOptions({
    name: 'BMTable',
    inheritAttrs: false,
  });

  const props = defineProps(bmTableProps);
  const emit = defineEmits(tableEmits);
  const slots = useSlots();

  // 表格内部状态
  const tableState = useTableState({ props, slots, emit });
  const {
    tableKey,
    tableRef,
    queryFormRef,
    getBindValues,
    headerSearchInputRef,
    headerSearchDataRef,
    innerWidthMap,
    paginationRef,
  } = tableState;
  // 表格内部方法
  const tableMethods = useTableMethods({ state: tableState, props, emit });
  const {
    setProps,
    fetchData,
    handleSubmit,
    handleReset,
    reload,
    handleTableChange,
    handleResizeColumn,
    updateHeaderSearchData,
  } = tableMethods;
  const tableAction: TableActionType = {
    setProps,
    reload,
    fetchData,
    updateHeaderSearchData,
  };
  // 表格列的配置描述
  const tableColumns = useColumns({
    props,
    slots,
    state: tableState,
    methods: tableMethods,
    tableAction,
  });

  const { innerColumns } = tableColumns;

  // 搜索表单
  const { getFormProps, replaceFormSlotKey, getFormSlotKeys } = useTableForm({
    tableState,
    tableMethods,
    slots,
  });

  // 表头搜索
  const headerSearch = useTableHeaderSearch({
    tableState,
    tableMethods,
  });
  const { tableHeaderSearch } = headerSearch;

  const { renderList, virtualizedClass, scrollTo } = useVirtualized({
    state: tableState,
  });

  onUnmounted(() => {
    // 清空 innerWidthMap map
    innerWidthMap.clear();
  });

  // 当前组件所有的状态和方法
  const instance = {
    ...props,
    ...tableState,
    ...tableMethods,
    ...headerSearch,
    ...tableColumns,
    refProps: toRefs(props),
    scrollTo,
    emit,
  };

  mountStyle('-bmos-table', style);

  createTableContext(instance);

  // TODO: 血源--有缓存也刷新列表
  // 挂载flag，防止多次请求
  let mountedFlag = false;
  onMounted(async () => {
    mountedFlag = true;
    await fetchData({ ...props.extraParams });
    mountedFlag = false;
  });

  onActivated(async () => {
    if (!mountedFlag) {
      fetchData({ ...props.extraParams });
    }
  });
  // 如果 extraParams 发生变化，重新请求数据
  watch(
    () => props.extraParams,
    (val: any, oldVal: any) => {
      if (props.isExtraParamsChangeQuery && val && !deepEqual(val, oldVal)) {
        if (isObject(paginationRef.value)) {
          paginationRef.value.current = 1;
        }
        fetchData({
          ...val,
          page_num: 1,
        });
      }
    },
    {
      deep: true,
    },
  );
  emit('register', instance);
  defineExpose(instance);
</script>
