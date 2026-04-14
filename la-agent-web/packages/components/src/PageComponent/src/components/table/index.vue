<template>
  <div class="bmos-page-component-table-content">
    <div
      v-if="showHeader"
      class="bmos-page-component-table-content-header"
      :class="[search === true ? 'bmos-page-component-table-content-header_search' : '']">
      <Row>
        <Col :span="12">
          <div class="bmos-page-component-table-content-header-title">
            <slot
              name="tableTopHeaderTitle"
              v-bind="{
                instance: tableRef,
                selectedRowKeys: selectedRowKeys,
                fetchData,
              }">
              <BMTableTitle v-if="title" :title="title"></BMTableTitle>
            </slot>
          </div>
        </Col>
        <Col :span="12">
          <div class="bmos-page-component-table-content-header-toolbar">
            <slot
              name="tableTopHeaderToolbar"
              v-bind="{
                instance: tableRef,
                selectedRowKeys: selectedRowKeys,
                fetchData,
              }"></slot>
          </div>
        </Col>
      </Row>
    </div>
    <div class="table-row">
      <BMTable
        ref="tableRef"
        :data-request="request"
        :dataSource="data"
        :columns="column"
        :search="search"
        :row-key="rowKey"
        :pagination="pagination"
        :isSelect="isSelect"
        :rowSelection="rowSelection"
        :isExtraParamsChangeQuery="isExtraParamsChangeQuery"
        :extraParams="tableField"
        :showToolBar="showToolBar"
        :showSearchBorder="showSearchBorder"
        :isMultipleSelect="isMultipleSelect"
        :showIndex="showIndex"
        :scroll="scroll"
        :form-props="formProps"
        :showRefresh="false"
        :bordered="bordered"
        :rowClassName="rowClassName"
        :expandFixed="expandFixed"
        :expandedRowKeys="expandedRowKeys"
        :rowExpandable="rowExpandable"
        :pageSizeChangeToFirst="pageSizeChangeToFirst"
        :dragSort="dragSort"
        @change="tableChange"
        @reset="reset"
        @expandedRowsChange="expandedRowsChange"
        @tableSortChange="tableSortChange"
        @handleClickRow="(record, key, keys) => handleRowClick(record, keys as KEY[])">
        <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
          <slot
            :name="slotName"
            v-bind="{
              instance: tableRef,
              selectedRowKeys: selectedRowKeys,
              record: { ...slotData.record },
              slotData,
            }"></slot>
        </template>
        <template #headerTitle>
          <slot
            name="tableHeaderTitle"
            v-bind="{
              instance: tableRef,
              selectedRowKeys: selectedRowKeys,
              fetchData,
            }">
            <BMTableTitle v-if="title" :title="title"></BMTableTitle>
          </slot>
        </template>
        <template #bodyCell="data">
          <slot name="bodyCell" v-bind="data"></slot>
        </template>

        <template #toolbar>
          <slot
            name="tableHeaderToolbar"
            v-bind="{
              currentNode: currentNode,
              instance: tableRef,
              selectedRowKeys: selectedRowKeys,
              fetchData,
            }"></slot>
          <span v-if="showHideSecondTableIcon" class="hide-second-icon-content">
            <Divider type="vertical" style="width: 2px" />
            <BMIcon type="DownArrow" style="cursor: pointer" @click="hideSecondTable" />
          </span>
        </template>
      </BMTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BMTable, BMTableTitle } from '../../../../index';
  import { tablesProps } from './props';
  import { Divider } from 'ant-design-vue';
  import { ref } from 'vue';
  import { KEY } from '../../type';
  import { BMIcon } from '../../../../Icon';

  const props = defineProps(tablesProps);
  const emit = defineEmits(['tableChange', 'reset', 'tableSortChange']);
  const tableRef = ref();
  const selectedRowKeys = ref<KEY[]>([]);
  const currentNode = ref();
  const tableChange = (rest: any, index: number) => {
    emit('tableChange', rest, index);
  };
  const tableSortChange = (tableData: any) => {
    emit('tableSortChange', tableData);
  };
  const reset = (rest: any) => {
    emit('reset', rest);
  };
  const handleRowClick = (record: any, keys: KEY[]) => {
    selectedRowKeys.value = keys;
    currentNode.value = record;
    if (props.rowClick) {
      props.rowClick(record, tableRef.value, keys);
    }
  };
  const fetchData = async (params?: any) => {
    await tableRef.value.fetchData(params);
  };

  const hideSecondTable = () => {
    props.swipeDown();
  };

  defineExpose({
    fetchData,
    getQueryFormRef: () => tableRef.value?.getQueryFormRef(),
    getTableRef: () => tableRef.value,
  });
</script>
