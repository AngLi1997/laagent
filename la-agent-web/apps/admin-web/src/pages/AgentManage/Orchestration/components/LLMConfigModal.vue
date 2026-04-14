<template>
  <BMModalForm
    ref="modalFormRef"
    :title="t('模型配置')"
    wrap-class-name="modalSizeMedium"
    :form-props="formProps"
    :trigger-button-text="t('参数')"
    :trigger-button-props="{
      type: 'default',
    }"
    :submit="submit"
    @update:open="updateOpen"
  />
</template>

<script setup lang="ts">
import type { FormProps, ModalFormInstance, Recordable } from '@bmos/components';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';

defineOptions({
  name: 'LLMConfigModal',
  inheritAttrs: false,
});

const config = defineModel('config', {
  type: Object,
  default: () => ({}),
});

const modalFormRef = ref<ModalFormInstance>();

const formProps = reactive<FormProps>({
  initialValues: {
    temperature: 0.8,
    top_k: 40,
    top_p: 0.9,
  },
  labelWidth: 120,
  layout: 'horizontal',
  schemas: [
    {
      label: 'temperature',
      field: 'temperature',
      required: true,
      component: 'SliderNumber',
      componentProps: {
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    {
      label: 'top_k',
      field: 'top_k',
      required: true,
      component: 'SliderNumber',
      componentProps: {
        min: 1,
        max: 100,
        step: 1,
      },
    },
    {
      label: 'top_p',
      field: 'top_p',
      required: true,
      component: 'SliderNumber',
      componentProps: {
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  ],
});

const setFormModels = (values: any) => {
  modalFormRef.value?.formRef?.setFormModels(values);
};

const updateOpen = async (val: boolean) => {
  if (val) {
    await nextTick();
    setFormModels(config.value);
  }
};

const submit = (formModal: Recordable) => {
  try {
    config.value = formModal;
    return Promise.resolve();
  }
  catch (_error: any) {
    return Promise.reject(_error);
  }
};
</script>

<style lang="less" scoped></style>
