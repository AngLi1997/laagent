<template>
  <NormalModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('预览分段')"
    wrap-class-name="modalSizeLarge"
    :show-ok-button="false"
  >
    <Flex vertical :gap="12">
      <RecallParagraph
        v-for="item in chunk_list"
        :key="item.id"
        :show-score="false"
        :show-tag="false"
        :show-doc="false"
        :chunk-index="item.chunk_index"
        :content-len="item.length"
        :content="item.content"
        :keywords="item.keywords"
      />
    </Flex>
  </NormalModalForm>
</template>

<script setup lang="ts">
import type { ModalFormInstance } from '@bmos/components';
import { RecallParagraph } from '@/components/RecallTesting/components/index';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Flex } from 'ant-design-vue';

interface ChunkType {
  chunk_index: number;
  id: number;
  content: string;
  keywords: string[];
  retrieval_count: number;
  length: number;
};

const open = ref(false);

const modalFormRef = ref<ModalFormInstance>();

const chunk_list = ref<ChunkType[]>([]);

const openModal = (chunks: ChunkType[]) => {
  chunk_list.value = chunks || [];
  open.value = true;
};

const closeModal = () => {
  open.value = false;
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style lang="less" scoped></style>
