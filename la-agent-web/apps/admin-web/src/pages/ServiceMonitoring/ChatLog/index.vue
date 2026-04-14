<!-- 对话日志 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('对话日志')]"
    :form-props="[formFirstProps]"
    :requests="[reqChatLogPage as DataRequestFn]"
    :columns="[columnsFirst]"
  />
  <ChatModel v-model:open="open" :title="chatTitle" :query="chatQuery" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqChatLogPage } from '@/api';
import ChatModel from '@/components/ChatModel/index.vue';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { useTable } from './hooks';

const { pageRef, columnsFirst, formFirstProps, open, chatTitle, chatQuery } = useTable();
</script>
