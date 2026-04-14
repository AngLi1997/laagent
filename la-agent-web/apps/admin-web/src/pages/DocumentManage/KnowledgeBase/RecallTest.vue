<!-- 知识库管理-召回测试 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="returnBack">
          {{ t('知识库管理') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ t('召回测试') }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="returnBack">
        {{ t('返回') }}
      </Button>
    </template>
    <RecallTesting :id id-convert="knowledge_base_id" :recall-api="reqKnowledgeBaseRetrieval" />
  </BreadcrumbButton>
</template>

<script lang="tsx" setup>
import { reqKnowledgeBaseRetrieval } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import RecallTesting from '@/components/RecallTesting/index.vue';
import { t } from '@bmos/i18n';

const router = useRouter();
const route = useRoute();

const returnBack = () => {
  router.push({
    name: 'KnowledgeBase',
  });
};

const id = computed(() => {
  return route.query.id as string;
});
</script>

<style lang="less" scoped>
  .recall-testing-main {
  padding: 0;
}
</style>
