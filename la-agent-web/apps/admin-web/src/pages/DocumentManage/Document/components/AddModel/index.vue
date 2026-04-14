<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('新增文档')"
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
</template>

<script setup lang="ts">
import { reqDocumentCreate } from '@/api';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
// import { saveLaboratoryInstrument, updateLaboratoryInstrument } from '@/services';
import { useForm } from './hooks';
// import { OperationStatusMap } from '@/types';

const emit = defineEmits(['submitSuccess']);

const open = ref(false);

const { modalFormRef, formProps, setFormModels, loading } = useForm();

const openModal = async (treeNode: any) => {
  open.value = true;
  await nextTick();
  setFormModels({
    category_id: treeNode.id === 'all' ? undefined : treeNode.id,
  });
};

const submit = async () => {
  try {
    loading.value = true;
    const formModal = await modalFormRef.value?.validate();
    const params = {
      ...formModal,
      addWay: undefined,
      record: undefined,
    };
    const { data } = await reqDocumentCreate(params);
    message.success(t('操作成功'));
    closeModal();
    emit('submitSuccess', data);
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
