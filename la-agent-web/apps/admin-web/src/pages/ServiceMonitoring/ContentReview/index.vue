<!-- 内容审查 -->
<template>
  <BMPageComponent
    ref="pageRef"
    :row-keys="['id']"
    :search="[true]"
    :hide-right-tree="true"
    :show-tool-bars="[true]"
    :titles="[t('词组列表')]"
    :form-props="[formFirstProps]"
    :requests="[reqChatReviewPage as DataRequestFn]"
    :columns="[columnsFirst]"
  >
    <template #tableHeaderToolbar0>
      <Button v-hasAuth="230040001000001" type="primary" @click="() => toCreateWord(OperationType.Add)">
        {{ t('创建词组') }}
      </Button>
    </template>
  </BMPageComponent>
  <RecordModal ref="recordModalRef" />
</template>

<script lang="ts" setup>
import type { DataRequestFn } from '@bmos/components';
import { reqChatReviewPage } from '@/api';
import { BMPageComponent } from '@bmos/components';
import { t } from '@bmos/i18n';
import { useTable } from './hooks';
import RecordModal from './Record.vue';
import { OperationType } from './type';

const { pageRef, columnsFirst, formFirstProps, toCreateWord, recordModalRef } = useTable();
</script>
