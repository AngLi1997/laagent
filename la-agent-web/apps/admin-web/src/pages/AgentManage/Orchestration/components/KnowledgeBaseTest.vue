<template>
  <NormalModalForm
    v-model:open="open"
    :title="t('知识库检索测试')"
    wrap-class-name="modalSizeLarge"
    :footer="null"
  >
    <RecallTesting :id layout="column" id-convert="knowledge_base_id" :recall-api="reqKnowledgeBaseRetrieval" />
  </NormalModalForm>
</template>

<script lang="tsx" setup>
import { reqKnowledgeBaseRetrieval } from '@/api';
import RecallTesting from '@/components/RecallTesting/index.vue';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    id?: string;
  }>(),
  {
    id: '',
  },
);

const open = defineModel<boolean>('knowledgeBaseTestOpen', {
  default: false,
});
</script>
