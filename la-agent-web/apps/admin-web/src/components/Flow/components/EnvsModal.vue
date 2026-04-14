<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('环境变量')"
    :form-props="formProps"
    wrap-class-name="modalSizeMedium"
    :footer="isView ? null : undefined"
    :submit="submit"
  />
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import { BMModalForm, BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { getUUID } from '@bmos/utils';
import { Button } from 'ant-design-vue';
import Env from './Env.vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    isView?: boolean;
  }>(),
  {
    isView: false,
  },
);

const emit = defineEmits<{
  (e: 'ok', formModal: Recordable): void;
}>();

const open = defineModel<boolean>('open', {
  default: false,
});
// 环境变量
const envs = defineModel('envs', {
  default: {},
});

const modalFormRef = ref<InstanceType<typeof BMModalForm>>();

watch(
  () => open.value,
  async (val) => {
    if (val) {
      await nextTick();
      modalFormRef.value?.formRef?.setFormModels({
        ...envs.value,
      });
    }
  },
);

const formProps = reactive<FormProps>({
  schemas: [
    {
      field: 'envs',
      formItemProps: {
        labelCol: { span: 24 },
      },
      labelFullWidth: true,
      disabledLabelWidth: true,
      noLabelTip: true,
      defaultValue: [
        {
          key: getUUID('env'),
        },
      ],
      label: ({ formModel }: RenderCallbackParams) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <BMTableTitle title={t('环境变量')} />
            <Button
              type="link"
              onClick={() => {
                if (!formModel.envs) {
                  formModel.envs = [];
                }
                formModel.envs.push({
                  key: getUUID('env'),
                });
              }}
            >
              {props.isView ? '' : t('添加环境变量')}
            </Button>
          </div>
        );
      },
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <Env
            v-model:list={formModel.envs}
            isView={props.isView}
          />
        );
      },
      dynamicRules({ formInstance }: RenderCallbackParams) {
        return [
          {
            required: false,
            trigger: 'blur',
            validator: async () => {
              try {
                const materialRef = formInstance?.compRefMap.get('envs');
                await materialRef?.validateForm();
                return Promise.resolve();
              }
              catch (_error) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject();
              }
            },
          },
        ];
      },
    },
  ],
});

const submit = async (formModal: Recordable) => {
  try {
    open.value = false;
    envs.value = formModal.envs;
    emit('ok', formModal.envs);
    return Promise.resolve();
  }
  catch (error: any) {
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
