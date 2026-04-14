<!-- 问题靶场 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('问题列表')]"
    :form-props="[formFirstProps]"
    :requests="[reqQuestionsQuery as DataRequestFn]"
    :columns="[columnsFirst]"
  >
    <template #tableHeaderToolbar0>
      <Button v-hasAuth="230040003000001" type="primary" @click="handleAdd">
        {{ t('创建问题') }}
      </Button>
    </template>
  </BMPageComponent>
  <AddModal v-model:open="addModalOpen" :status="operationType" :row-data @ok="updateTable" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqQuestionsQuery } from '@/api';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import AddModal from './components/AddModal.vue';
import { useTable } from './hooks';

const {
  pageRef,
  columnsFirst,
  formFirstProps,
  addModalOpen,
  operationType,
  rowData,
  handleAdd,
  updateTable,
} = useTable();
</script>
