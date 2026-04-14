<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('文档分片')"
    wrap-class-name="modalSizeLarge"
    :form-props="formProps"
    @ok="submit"
    @cancel-modal="closeModal"
  >
    <template #footer>
      <Button @click="closeModal">
        {{ t('取消') }}
      </Button>
      <Button :loading="loading" type="primary" @click="submit">
        {{ t('确定') }}
      </Button>
    </template>
  </BMModalForm>
  <PreviewParagraph ref="previewParagraphRef" />
</template>

<script setup lang="ts">
import { reqDocumentSplitSave } from '@/api';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
// import { saveLaboratoryInstrument, updateLaboratoryInstrument } from '@/services';
import { useForm } from './hooks';
import PreviewParagraph from './PreviewParagraph.vue';
// import { OperationStatusMap } from '@/types';

defineOptions({
  name: 'SaveChunk',
  inheritAttrs: false,
});

const emit = defineEmits(['submitSuccess']);

const open = ref(false);

const { modalFormRef, formProps, previewParagraphRef, setFormModels, loading } = useForm();

const openModal = async (document_id: string) => {
  open.value = true;
  await nextTick();
  setFormModels({
    document_id,
  });
};

const submit = async () => {
  try {
    loading.value = true;
    const formModal = await modalFormRef.value?.validate();
    await reqDocumentSplitSave(formModal);
    message.success(t('操作成功'));
    closeModal();
    emit('submitSuccess');
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
  finally {
    loading.value = false;
  }
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
