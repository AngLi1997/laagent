<template>
  <div class="bmos-page-component-right-container">
    <BTable
      v-bind="getProps(0)"
      :ref="tableRefs[0]"
      :table-field="firstField"
      :row-click="handleRowClick0"
      @tableChange="rest => tableChange(rest, 0)"
      @table-sort-change="tableData => tableSortChange(tableData, 0)"
      @reset="params => reset(params)">
      <template
        v-for="slotName of Object.keys($slots).map(item => subIndexSlot(item, 0))"
        #[slotName]="slotData"
        :key="slotName">
        <slot
          v-if="
            ['tableTopHeaderTitle', 'tableTopHeaderToolbar', 'tableHeaderTitle', 'tableHeaderToolbar'].includes(
              slotName,
            )
          "
          :name="createSlotName(slotName, 0)"
          v-bind="{
            ...slotData,
            currentNodes: { 0: firstCurrentNode, 1: secondCurrentNode },
          }"></slot>
        <slot v-else :name="createSlotName(slotName, 0)" v-bind="slotData"></slot>
      </template>
    </BTable>
    <div v-if="columns.length > 1 && showSecondTable" class="line"></div>
    <BTable
      v-if="columns.length > 1"
      v-bind="getProps(1)"
      :ref="tableRefs[1]"
      :search="false"
      :row-click="handleRowClick1"
      show-hide-second-table-icon
      :swipe-down="swipeDown"
      :class="['second-table', showSecondTable ? 'show-second-table' : 'hide-second-table']"
      :table-field="secondField"
      @tableChange="rest => tableChange(rest, 1)"
      @table-sort-change="tableData => tableSortChange(tableData, 1)"
      @reset="params => reset(params)">
      <template
        v-for="slotName of Object.keys($slots).map(item => subIndexSlot(item, 1))"
        #[slotName]="slotData"
        :key="slotName">
        <slot
          v-if="
            ['tableTopHeaderTitle', 'tableTopHeaderToolbar', 'tableHeaderTitle', 'tableHeaderToolbar'].includes(
              slotName,
            )
          "
          :name="createSlotName(slotName, 1)"
          v-bind="{
            ...slotData,
            currentNodes: { 0: firstCurrentNode, 1: secondCurrentNode },
          }"></slot>
        <slot v-else :name="createSlotName(slotName, 1)" v-bind="slotData"></slot>
      </template>
    </BTable>
    <div v-if="columns.length > 1 && !showSecondTable" class="swipe-up">
      <BMIcon type="SwipeUp" @click="swipeUp" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { createSlotName } from './columns';
  import { tablesProps } from './props/tables';
  import type { TableInstance } from '../../Table';
  import BTable from './components/table/index.vue';
  import { ref } from 'vue';
  import { KEY } from './type';
  import { objectEach, isUnDef } from '@bmos/utils';
  import { computed, watch } from 'vue';
  import { BMIcon } from '../../Icon';
  import { Recordable } from '../../all';

  const props = defineProps(tablesProps);
  const emit = defineEmits(['change', 'tableChange', 'reset', 'tableSortChange']);
  const firstCurrentNode = ref<Recordable>();
  const secondCurrentNode = ref<Recordable>();
  // 第二个表格选中的数据
  const selectedSecondRowKeys = ref<KEY[]>([]);
  const tableRefs = {
    0: ref(),
    1: ref(),
  };
  // 第一个table的选择
  const selectedFirstRowKeys = ref<KEY[]>([]);
  const firstRowSelection = ref<Recordable>({
    selectedRowKeys: selectedFirstRowKeys.value,
    ...(props.rowSelections?.[0] && props.rowSelections?.[0]),
  });

  const showSecondTable = ref<boolean>(false);

  const secondRowSelection = ref<Recordable>({
    selectedRowKeys: selectedSecondRowKeys.value,
    ...(props.rowSelections?.[1] && props.rowSelections?.[1]),
  });
  const handleRowClick0 = (record: any, instance: TableInstance, keys: KEY[]) => {
    firstRowSelection.value = {
      ...firstRowSelection.value,
      selectedRowKeys: keys,
    };
    secondRowSelection.value = {
      ...secondRowSelection.value,
      selectedRowKeys: [],
    };
    firstCurrentNode.value = record;
    secondCurrentNode.value = {};
    if (props.rowClick) {
      props.rowClick(record, 0, instance, keys);
    }
    showSecondTable.value = true;
    tableRefs[1]?.value?.getTableRef()?.clearTableHeaderSearch?.();
  };

  const handleRowClick1 = (record: any, instance: TableInstance, keys: KEY[]) => {
    secondRowSelection.value = {
      ...secondRowSelection.value,
      selectedRowKeys: keys,
    };
    secondCurrentNode.value = record;
    if (props.rowClick) {
      props.rowClick(record, 1, instance, keys);
    }
  };

  const getRowSelection = (index: number, isSelect: boolean, rowSelection: any) => {
    if (index === 0 && isSelect) {
      return firstRowSelection.value;
    }
    if (index === 1 && isSelect) {
      return secondRowSelection.value;
    }
    if (index === 0 && !isSelect && rowSelection) {
      return {
        ...rowSelection,
      };
    }
    if (index === 1 && !isSelect && rowSelection) {
      return {
        ...rowSelection,
      };
    }
    return null;
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

  const setProps = computed(() => {
    return (index: number) => {
      const {
        requests,
        dataSources,
        columns,
        scrolls,
        rowKeys = ['id', 'id'],
        search = [true, false],
        formProps,
        titles,
        showToolBars = [true, true],
        showHeader,
        rowSelections = [null, null],
        isMultipleSelects = [false, false],
        isSelects = [true, false],
        showIndexs = [false, false],
        showSearchBorders = [true, true],
        bordereds = [false, false],
        rowClassNames = [() => '', () => ''],
        paginations,
        expandFixeds,
        expandedRowKeys,
        rowExpandables,
        expandedRowsChanges,
        isExtraParamsChangeQuerys = [true, true],
        pageSizeChangeToFirsts = [false, false],
        dragSorts = [false, false],
      } = props;
      const searchs = typeof search === 'boolean' ? search : search[index];
      return {
        request: requests[index] || requests[0],
        data: dataSources?.[index] || dataSources?.[0],
        column: columns[index],
        scroll: scrolls[index] || scrolls[0],
        rowKey: rowKeys?.[index] || rowKeys[0],
        search: searchs,
        formProps: formProps?.[index] ? { ...formProps[index] } : { ...formProps?.[0] },
        title: titles?.[index],
        showToolBar: showToolBars ? showToolBars?.[index] : showToolBars[index],
        showHeader: showHeader?.[index] || false,
        rowSelection: getRowSelection(index, columns.length > 1 ? isSelects[index] : false, rowSelections[index]),
        isMultipleSelect: isMultipleSelects[index] || false,
        isSelect: columns.length > 1 ? isSelects[index] : false,
        showIndex: showIndexs[index] || false,
        showSearchBorder: showSearchBorders[index] || false,
        bordered: bordereds[index] || false,
        rowClassName: rowClassNames[index],
        ...(columns.length < 2
          ? {
              pagination: {
                pageSize: 20,
              },
            }
          : {}),
        ...(!isUnDef(paginations?.[index])
          ? {
              pagination: paginations[index],
            }
          : {}),
        ...(expandedRowKeys?.[index] ? { expandedRowKeys: expandedRowKeys?.[index] } : {}),
        expandFixed: expandFixeds?.[index] || false,
        rowExpandable: rowExpandables?.[index] ?? undefined,
        expandedRowsChange: expandedRowsChanges?.[index],
        isExtraParamsChangeQuery: isExtraParamsChangeQuerys?.[index] ?? true,
        pageSizeChangeToFirst: pageSizeChangeToFirsts?.[index] ?? false,
        dragSort: dragSorts?.[index] ?? false,
      };
    };
  });

  const getProps = (index: number) => {
    return setProps.value(index);
  };

  const swipeUp = () => {
    showSecondTable.value = true;
  };
  const swipeDown = () => {
    showSecondTable.value = false;
  };

  watch(
    () => props.treeField,
    () => {
      firstRowSelection.value = {
        ...(props.rowSelections?.[0] && props.rowSelections?.[0]),
        selectedRowKeys: [],
      };
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.rowSelections,
    () => {
      if (props.rowSelections?.[0]) {
        firstRowSelection.value = {
          selectedRowKeys: [],
          ...(props.rowSelections?.[0] && props.rowSelections?.[0]),
        };
      }
    },
    {
      deep: true,
    },
  );

  const firstField = computed(() => {
    return { ...props.fields?.[0]?.default, ...props.treeField };
  });

  const secondField = computed(() => {
    if (props.columns.length === 1 || !props.fields || props.fields?.length < 2) return {};
    const field = props.fields[1];
    const f = field.field;
    const obj = field.default || {};
    if (f) {
      objectEach(f, (v, k) => {
        obj[k] = firstCurrentNode.value?.[v];
      });
    }

    return obj;
  });

  watch(
    () => [props.treeField, props.fields],
    () => {
      firstCurrentNode.value = [];
      secondCurrentNode.value = {};
      secondRowSelection.value = {
        ...(props.rowSelections?.[1] && props.rowSelections?.[1]),
        selectedRowKeys: [],
      };
    },
  );

  const subIndexSlot = (slotName: string, index: number) => {
    return slotName.replace(index.toString(), '');
  };
  defineExpose({
    fetchData: async (index: number, params?: any, noResetFirstSelect?: boolean) => {
      if (props.columns.length < index) return;
      if (index === void 0 || index === 0) {
        if (!noResetFirstSelect) {
          firstRowSelection.value = {
            ...firstRowSelection.value,
            selectedRowKeys: [],
          };
          firstCurrentNode.value = {};
        }
        secondRowSelection.value = {
          ...secondRowSelection.value,
          selectedRowKeys: [],
        };
        secondCurrentNode.value = {};
        await tableRefs[0].value.fetchData(params);
        return;
      }
      await tableRefs[0]?.value.fetchData();
      await tableRefs[1]?.value.fetchData(params);
    },
    getQueryFormRef: (index: number) => {
      if (props.columns.length < index) return;
      if (index === void 0 || index === 0) {
        return tableRefs[0].value.getQueryFormRef();
      }
      return tableRefs[1]?.value.getQueryFormRef();
    },
    getTableRef: (index: number) => {
      if (props.columns.length < index) return;
      if (index === void 0 || index === 0) {
        return tableRefs[0].value.getTableRef();
      }
      return tableRefs[1]?.value.getTableRef();
    },
  });
</script>
