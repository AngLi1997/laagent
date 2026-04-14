<!-- 模型配置-详情 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="returnBack">
          {{ t('模型配置') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ t('新增模型') }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="returnBack">
        {{ t('返回') }}
      </Button>
      <Button type="primary" @click="save">
        {{ t('保存') }}
      </Button>
    </template>
    <BMForm ref="formRef" v-bind="formProps" />
  </BreadcrumbButton>
</template>

<script setup lang="ts">
import type { formInstance, FormProps } from '@bmos/components';
import { BMForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button, message } from 'ant-design-vue';
import { reqAgentModelCreate } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import { KeyType } from './type';

const router = useRouter();

const returnBack = () => {
  router.push({
    name: 'ModelConfig',
  });
};

const formRef = ref<formInstance>();
const formProps: Partial<FormProps> = {
  showAdvancedButton: false,
  showActionButtonGroup: false,
  schemas: [
    {
      field: 'name',
      component: 'Input',
      label: t('模型名称'),
      required: true,
    },
    {
      field: 'version',
      component: 'Input',
      label: t('模型版本'),
      required: true,
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: t('模型描述'),
    },
    {
      field: 'args',
      component: 'Input',
      label: t('模型参数大小'),
      required: true,
    },
    {
      field: 'temperature',
      component: 'InputNumber',
      label: t('创造力'),
      required: true,
      componentProps: {
        min: 0,
        max: 2,
        step: 0.1,
        precision: 1,
        style: {
          width: '100%',
        },
      },
    },
    {
      field: 'url',
      component: 'Input',
      label: t('模型地址'),
      required: true,
    },
    {
      field: 'api_key',
      component: 'Input',
      label: t('apiKey'),
      required: true,
    },
    {
      field: 'key_type',
      component: 'Select',
      label: t('密钥类型'),
      required: true,
      componentProps: {
        options: [
          { label: KeyType.OPENAI, value: KeyType.OPENAI },
          { label: KeyType.OLLAMA, value: KeyType.OLLAMA },
        ],
      },
    },
  ],
};

const save = async () => {
  try {
    const formData = await formRef.value?.validate();
    await reqAgentModelCreate(formData);
    message.success(t('保存成功'));
    returnBack();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
</script>
