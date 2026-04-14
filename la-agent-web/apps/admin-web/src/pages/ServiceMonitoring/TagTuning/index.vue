<!-- 标记调优 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('会话列表')]"
    :form-props="[formFirstProps]"
    :requests="[reqTagTuningPage as DataRequestFn]"
    :columns="[columnsFirst]"
  >
    <template #tableHeaderToolbar0>
      <!-- <Button type="primary" @click="handleAdd">
        {{ t('创建问题') }}
      </Button> -->
    </template>
  </BMPageComponent>
  <ChatModel v-model:open="open" :title="chatTitle" :query="chatQuery" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqTagTuningPage } from '@/api';
import ChatModel from '@/components/ChatModel/index.vue';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { useTable } from './hooks';

defineOptions({
  name: 'TagTuning',
});

const { pageRef, columnsFirst, formFirstProps, open, chatTitle, chatQuery } = useTable();
</script>
