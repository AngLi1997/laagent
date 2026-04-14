<!-- 工具配置 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('工具列表')]"
    :form-props="[formFirstProps]"
    :requests="[reqAgentToolsQuery as DataRequestFn]"
    :columns="[columnsFirst]"
  >
    <template #tableHeaderToolbar0>
      <PermissionModal v-model:permission-open="permissionModalOpen" :resource-id="rowData?.id" @ok="savePermission" />
      <Button v-hasAuth="230010002000001" type="primary" @click="handleAdd">
        {{ t('新增工具') }}
      </Button>
    </template>
  </BMPageComponent>
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqAgentToolsQuery } from '@/api';
import PermissionModal from '@/components/PermissionDept/index.vue';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { useTable } from './hooks';
import { OperationType } from './type';

const router = useRouter();

const { pageRef, columnsFirst, formFirstProps, rowData, permissionModalOpen, savePermission } = useTable();

const handleAdd = () => {
  router.push({
    name: 'BasicDataToolConfigDetail',
    query: {
      status: OperationType.Add,
    },
  });
};
</script>
