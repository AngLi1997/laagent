<!-- 模型配置 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('模型列表')]"
    :form-props="[formFirstProps]"
    :requests="[reqAgentModelsQuery as DataRequestFn]"
    :columns="[columnsFirst]"
  >
    <template #tableHeaderToolbar0>
      <Button type="primary" @click="handleAdd">
        {{ t('新增模型') }}
      </Button>
    </template>
  </BMPageComponent>
  <ChatModel v-model:open="chatModelOpen" :query="chatQuery" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button } from 'ant-design-vue';
import { reqAgentModelsQuery } from '@/api';
import ChatModel from '@/components/ChatModel/index.vue';
import { useTable } from './hooks';
import { OperationType } from './type';

const router = useRouter();

const {
  pageRef,
  columnsFirst,
  formFirstProps,
  chatModelOpen,
  chatQuery,
} = useTable();

const handleAdd = () => {
  router.push({
    name: 'BasicDataModelConfigDetail',
    query: {
      status: OperationType.Add,
    },
  });
};
</script>
