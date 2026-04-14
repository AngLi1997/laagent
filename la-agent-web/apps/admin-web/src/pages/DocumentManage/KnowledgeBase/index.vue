<!-- 知识库管理 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :columns="columns"
    :requests="requests"
    :show-all-add-icon="hasPermission('230020002000001')"
    :show-action="
      hasPermission('230020002000001') || hasPermission('230020002000002') || hasPermission('230020002000003')
    "
    :action-list="actionList"
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
    @tree-action="handleTreeAction"
  >
    <template #tableHeaderToolbar0="{ treeNode }">
      <Button v-hasAuth="230020002000004" type="primary" @click="() => handleAddDataset(treeNode)">
        {{ t('新增知识库') }}
      </Button>
    </template>
    <template #tableHeaderTitle0>
      <BMTableTitle :title="t('知识库列表')" />
    </template>
  </BMPageComponent>
  <BMModalForm
    v-model:open="treeModalOpen"
    :title="treeModalTitle"
    :form-props="treeModalFormProps"
    wrap-class-name="modalSizeMedium"
    :submit="treeModalSubmit"
  />
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission';
import { BMModalForm, BMPageComponent, BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button, message } from 'ant-design-vue';
import { useTables } from './hooks';
import { OperationType } from './type';

const router = useRouter();
const { hasPermission } = usePermissionStore();

const {
  requests,
  columns,
  treeData,
  pageRef,
  formFirstProps,
  actionList,
  handleTreeAction,
  treeModalOpen,
  treeModalTitle,
  treeModalFormProps,
  treeModalSubmit,
} = useTables();

const handleAddDataset = (treeNode: any) => {
  if(!treeNode.id || treeNode.id === 'all') {
    message.error(t('请先选择知识库分类'));
    return;
  }
  router.push({
    name: 'DocumentManageKnowledgeBaseDetail',
    query: {
      type: OperationType.Add,
      ...(treeNode.id && treeNode.id !== 'all' && { category_id: treeNode.id }),
    },
  });
};
</script>

<style scoped lang="less"></style>
