<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('接口测试')"
    :form-props="formProps"
    wrap-class-name="modalSizeMedium"
    :footer="null"
  />
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import { reqAgentToolRequest } from '@/api';
import Editor from '@/components/Editor/index.vue';
import { BMModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button, message } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    testApiData?: Recordable;
  }>(),
  {
    testApiData: () => ({}),
  },
);

const open = defineModel<boolean>('testModalOpen', {
  default: false,
});

const modalFormRef = ref<InstanceType<typeof BMModalForm>>();

const formProps = reactive<FormProps>({
  schemas: [
    {
      field: 'inputInfo',
      component: 'Divider',
      label: t('输入内容'),
      colProps: {
        span: 24,
      },
      componentProps: {
        orientation: 'left',
        orientationMargin: '0px',
        showLeftBorder: true,
      },
    },
    {
      field: 'input',
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <div style={{ height: '200px', width: '100%' }}>
            <Editor v-model={formModel.input} language="json" showBorder />
          </div>
        );
      },
      noLabel: true,
    },
    {
      field: 'test',
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <Button
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={async () => {
              try {
                let request_data;
                try {
                  request_data = JSON.parse(formModel.input);
                }
                catch (_error) {
                  request_data = formModel.input;
                }
                const { data } = await reqAgentToolRequest({
                  ...props.testApiData,
                  request_data,
                });
                formModel.output = JSON.stringify(data, null, 2);
              }
              catch (error: any) {
                error.message && message.error(error.message);
              }
            }}
          >
            {t('测试')}
          </Button>
        );
      },
      noLabel: true,
    },
    {
      field: 'outputInfo',
      component: 'Divider',
      label: t('输出结果'),
      colProps: {
        span: 24,
      },
      componentProps: {
        orientation: 'left',
        orientationMargin: '0px',
        showLeftBorder: true,
      },
    },
    {
      field: 'output',
      noLabel: true,
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <div style={{ height: '200px' }}>
            <Editor v-model={formModel.output} language="json" showBorder />
          </div>
        );
      },
    },
  ],
});
</script>
