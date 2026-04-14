<!-- 文档管理 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :action-list="actionList"
    :row-keys="['id']"
    :tree-data="treeData"
    :search="[true, false]"
    :form-props="[formFirstProps]"
    :titles="[t('文档列表')]"
    :field-names="{
      title: 'name',
      key: 'id',
      children: 'children',
    }"
    :tree-field="{
      field: {
        category_id: 'id',
      },
    }"
    :selected-keys="treeSelectedKeys"
    :table-fields="[
      {},
      {
        field: {
          id: 'id',
          category_id: 'category_id',
        },
      },
    ]"
    :requests="[getDataList as DataRequestFn]"
    :columns="[columnsFirst]"
    @tree-action="handleTreeAction"
  >
    <template #tableHeaderToolbar0="{ treeNode }">
      <Button v-hasAuth="230020001000004" type="primary" @click="() => openAddModel(treeNode)">
        {{ t('新增文档') }}
      </Button>
    </template>
  </BMPageComponent>
  <AddModel
    ref="addModelRef" @submit-success="(document_id) => {
      updateTable()
      saveChunkRef?.openModal(document_id)
    }"
  />
  <SaveChunk ref="saveChunkRef" @submit-success="updateTable" />
  <BMModalForm
    v-model:open="treeModalOpen"
    :title="treeModalTitle"
    :form-props="treeModalFormProps"
    wrap-class-name="modalSizeMedium"
    :submit="treeModalSubmit"
  />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqDocumentPage } from '@/api';
import { BMModalForm, BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { ref, useTemplateRef } from 'vue';
import { AddModel, SaveChunk } from './components';
// import { reqFlowAuditList, reqGetFlowConfigTreeReq, reqFlowConfigBindProcessReq } from '@/services';
import { useTable } from './hooks';

const addModelRef = ref<InstanceType<typeof AddModel>>();

const saveChunkRef = useTemplateRef('saveChunkRef');

const openAddModel = (treeNode: any) => {
  addModelRef.value?.openModal(treeNode);
};

const getDataList = async (params: any) => {
  return await reqDocumentPage({
    ...params,
    category_id: params.category_id === 'all' ? undefined : params.category_id,
  });
};

const {
  pageRef,
  updateTable,
  columnsFirst,
  formFirstProps,
  treeData,
  actionList,
  handleTreeAction,
  treeSelectedKeys,
  treeModalOpen,
  treeModalTitle,
  treeModalFormProps,
  treeModalSubmit,
} = useTable();
</script>

<style lang="less" scoped></style>
