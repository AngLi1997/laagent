<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="titleCmp"
    wrap-class-name="modalSizeMedium edit-paragraph"
    :form-props="formProps"
    :show-ok-button="modalType !== modalTypeEnum.VIEW"
    :submit="submit"
  />
</template>

<script setup lang="ts">
import { reqDocumentChunkCreate, reqDocumentChunkUpdate } from '@/api';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { modalTypeEnum } from '../types';
// import { saveLaboratoryInstrument, updateLaboratoryInstrument } from '@/services';
import { useForm } from './hooks';
// import { OperationStatusMap } from '@/types';

defineOptions({
  name: 'EditParagraph',
});

const props = defineProps({
  documentId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submitSuccess']);

const open = ref(false);

const modalType = ref<modalTypeEnum>(modalTypeEnum.ADD);

const chunk_index = ref(0);

const titleCmp = computed(() => {
  switch (modalType.value) {
    case modalTypeEnum.EDIT:
      return `${t('编辑分段')}-${chunk_index.value}`;
    case modalTypeEnum.VIEW:
      return `${t('查看分段')}-${chunk_index.value}`;
    case modalTypeEnum.ADD:
    default:
      return t('添加分段');
  }
});

const { modalFormRef, formProps, setFormModels } = useForm();

const openModal = async (type: modalTypeEnum, record: any) => {
  modalType.value = type;
  chunk_index.value = record?.chunk_index;
  open.value = true;
  await nextTick();
  setFormModels({
    ...record,
    isEdit: type !== modalTypeEnum.VIEW,
  });
};

const submit = async (formModel: any) => {
  try {
    const params = {
      ...formModel,
      isEdit: undefined,
      document_id: props.documentId,
    };
    if (modalType.value === modalTypeEnum.EDIT) {
      await reqDocumentChunkUpdate(params);
    }
    else {
      await reqDocumentChunkCreate(params);
    }
    message.success(t('操作成功'));
    closeModal();
    emit('submitSuccess');
  }
  catch (error: any) {
    error.message && message.error(error.message);
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

<style lang="less">
  .edit-paragraph {
  .content-textarea {
    padding: 12px;
    &:focus-visible {
      outline: none;
    }
  }
}
</style>
