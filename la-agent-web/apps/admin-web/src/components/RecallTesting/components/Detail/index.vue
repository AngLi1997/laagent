<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('段落详情')"
    wrapClassName="modalSizeMedium"
    :formProps="formProps"
    :showOkButton="false"
    :showCancelButton="false"
    @cancelModal="closeModal"></BMModalForm>
</template>

<script setup lang="ts">
  import { t } from '@bmos/i18n';
  import { useForm } from './hooks/useForm';
  import { BMModalForm } from '@bmos/components';

  const open = ref(false);

  const { modalFormRef, formProps, setFormModels } = useForm();

  const openModal = async (record: any) => {
    open.value = true;
    await nextTick();
    setFormModels(record);
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
  .paragraph-content {
    font-size: 14px;
    color: #242526;
    line-height: 18px;
    margin-bottom: 16px;
    &-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
    }
  }
</style>
