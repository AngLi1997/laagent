<template>
  <NormalModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('拦截记录')"
    wrap-class-name="modalSizeLarge intercept"
    :show-ok-button="false"
  >
    <BMTable
      ref="tableRef"
      :columns="columns"
      :search="false"
      :extra-params="{
        chat_review_id,
      }"
      :scroll="{ x: 400, y: 300 }"
      :data-request="reqChatReviewInterceptionRecord"
    />
  </NormalModalForm>
</template>

<script setup lang="ts">
import type { ModalFormInstance, TableColumn } from '@bmos/components';
import { reqChatReviewInterceptionRecord } from '@/api';
import { BMTable, NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';

defineOptions({
  name: 'RecordModal',
  inheritAttrs: false,
});

const open = ref(false);

const modalFormRef = ref<ModalFormInstance>();

const tableRef = ref();

const chat_review_id = ref('');

const columns = reactive<TableColumn[]>([
  {
    title: t('命中敏感词'),
    dataIndex: 'hit_keyword',
    width: 100,
  },
  {
    title: t('消息'),
    dataIndex: 'message',
    width: 200,
  },
]);

const openModal = async (id: string) => {
  chat_review_id.value = id;
  open.value = true;
  await nextTick();
  tableRef.value?.fetchData();
};

const closeModal = () => {
  open.value = false;
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<style lang="less" scoped>

</style>

<style lang="less">
.intercept {
  .bmos-table {
    height: 40vh;
  }
}
</style>
