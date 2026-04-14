<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('编辑参数')"
    :form-props="formProps"
    wrap-class-name="modalSizeMedium"
    :submit="submit"
  />
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable } from '@bmos/components';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    record?: Recordable;
  }>(),
  {
    record: () => ({}),
  },
);

const emit = defineEmits(['ok']);

const open = defineModel<boolean>('paramsModalOpen', {
  default: false,
});

const modalFormRef = ref<InstanceType<typeof BMModalForm>>();
watch(
  () => open.value,
  async (val) => {
    if (val) {
      await nextTick();
      modalFormRef.value?.formRef?.setFormModels({
        ...props.record,
      });
    }
  },
);

const formProps = reactive<FormProps>({
  schemas: [
    {
      field: 'name',
      component: 'Input',
      label: t('参数'),
      required: true,
    },
    {
      field: 'paramType',
      component: 'Select',
      label: t('数据类型'),
      required: true,
      componentProps: {
        options: [
          { label: 'int', value: 'int' },
          { label: 'float', value: 'float' },
          { label: 'string', value: 'string' },
          { label: 'boolean', value: 'boolean' },
          { label: 'list', value: 'list' },
          { label: 'map', value: 'map' },
        ],
      },
    },
    {
      field: 'required',
      component: 'RadioGroup',
      label: t('是否必填'),
      required: true,
      componentProps: {
        options: [
          { label: t('是'), value: true },
          { label: t('否'), value: false },
        ],
      },
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: t('参数描述'),
    },
  ],
});

const submit = async (formModal: Recordable) => {
  try {
    emit('ok', formModal);
    open.value = false;
    return Promise.resolve();
  }
  catch (_error: any) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject();
  }
};
</script>

<style scoped lang="less">
  .depart-btn {
  display: inline-flex;
  column-gap: 8px;
  align-items: center;
}
</style>
