<template>
  <!-- Agent 编排 -->
  <BMPageComponent
    ref="pageRef"
    :columns="columns"
    :requests="requests"
    :show-all-add-icon="hasPermission('230030001000001')"
    :show-action="
      hasPermission('230030001000001') || hasPermission('230030001000002') || hasPermission('230030001000003')
    "
    :row-keys="['id']"
    :search="[true, false]"
    :tree-data="treeData"
    :form-props="[formFirstProps, {}]"
    :field-names="{
      title: 'name',
      key: 'id',
    }"
    :tree-field="{
      field: {
        category_id: 'id',
      },
    }"
    :action-list="actionList"
    @tree-action="handleTreeAction"
  >
    <template #tableHeaderToolbar0="{ treeNode }">
      <PermissionModal v-model:permission-open="permissionModalOpen" :resource-id="rowData?.id" @ok="savePermission" />
      <Button v-hasAuth="230030001000004" type="primary" @click="() => handleAdd(treeNode)">
        {{ t('新增应用') }}
      </Button>
    </template>
    <template #tableHeaderTitle0>
      <BMTableTitle :title="t('应用列表')" />
    </template>
  </BMPageComponent>
  <BMModalForm
    v-model:open="treeModalOpen"
    :title="treeModalTitle"
    :form-props="treeModalFormProps"
    wrap-class-name="modalSizeMedium"
    :submit="treeModalSubmit"
  />
  <ChatModel v-model:open="openChat" :title="t('调试')" :query="chatQuery" />
  <PublishAgent :id="publishQuery.id" v-model:open="openPublish" />
  <AddModal
    :id="rowData?.id"
    v-model:open="addModalOpen"
    :status="addModalStatus"
    :category-id="addModalCategoryId"
    @ok="updateTable"
    @add="(id: string) => toDetail(id)"
  />
</template>

<script setup lang="ts">
import ChatModel from '@/components/ChatModel/index.vue';
import PermissionModal from '@/components/PermissionDept/index.vue';
import { usePermissionStore } from '@/stores/permission';
import { BMModalForm, BMPageComponent, BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button } from 'ant-design-vue';
import AddModal from './components/AddModal.vue';
import PublishAgent from './components/PublishAgent.vue';
import { useTables } from './hooks';
import { OperationType } from './type';

const { hasPermission } = usePermissionStore();

const {
  requests,
  columns,
  treeData,
  pageRef,
  formFirstProps,
  permissionModalOpen,
  savePermission,
  rowData,
  actionList,
  handleTreeAction,
  treeModalOpen,
  treeModalTitle,
  treeModalFormProps,
  treeModalSubmit,
  openChat,
  chatQuery,
  openPublish,
  publishQuery,
  updateTable,
  addModalOpen,
  addModalStatus,
  addModalCategoryId,
  toDetail,
} = useTables();

const handleAdd = (treeNode: any) => {
  addModalOpen.value = true;
  addModalStatus.value = OperationType.Add;
  addModalCategoryId.value = treeNode.id && treeNode.id !== 'all' ? treeNode.id : undefined;
};
</script>

<style scoped lang="less"></style>
