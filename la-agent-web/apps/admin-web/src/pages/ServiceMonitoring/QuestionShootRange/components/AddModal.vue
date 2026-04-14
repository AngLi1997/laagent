<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title
    :form-props="formProps"
    wrap-class-name="modalSizeMedium"
    :submit="submit"
  />
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable } from '@bmos/components';
import { reqQuestionsCreate, reqQuestionsUpdate } from '@/api';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { OperationType } from '../type';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    rowData?: Recordable;
    status?: OperationType;
  }>(),
  {
    status: OperationType.Add,
    rowData: () => ({}),
  },
);

const emit = defineEmits<{
  (e: 'ok'): void;
}>();

const open = defineModel<boolean>('open', {
  default: false,
});

const modalFormRef = ref<InstanceType<typeof BMModalForm>>();
const title = computed(() => {
  return props.status === OperationType.Edit ? t('编辑问题') : t('创建问题');
});
watch(
  () => open.value,
  async (val) => {
    if (val) {
      await nextTick();
      if (props.status === OperationType.Edit) {
        modalFormRef.value?.formRef?.setFormModels({
          ...props.rowData,
        });
      }
    }
  },
);

const formProps = reactive<FormProps>({
  schemas: [
    {
      field: 'question',
      component: 'Input',
      label: t('提问'),
      required: true,
    },
    {
      field: 'answer',
      component: 'InputTextArea',
      label: t('回答'),
      componentProps: {
        rows: 4,
      },
    },
  ],
});

const submit = async (formModal: Recordable) => {
  try {
    if (props.status === OperationType.Edit) {
      await reqQuestionsUpdate({
        question: formModal.question,
        answer: formModal.answer,
        id: props.rowData.id,
      });
    }
    else {
      await reqQuestionsCreate({
        question: formModal.question,
        answer: formModal.answer,
      });
    }
    open.value = false;
    emit('ok');
    return Promise.resolve();
  }
  catch (error: any) {
    error.message && message.error(error.message);
    return Promise.reject(new Error(error.message || 'An unknown error occurred'));
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
