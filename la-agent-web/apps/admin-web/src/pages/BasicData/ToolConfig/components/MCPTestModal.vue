<template>
  <NormalModalForm
    v-model:open="open"
    :title="t('可用工具')"
    wrap-class-name="modalSizeLarge mcpTestModal"
    :footer="null"
  >
    <Collapse v-model:active-key="activeKey" accordion>
      <CollapsePanel v-for="item in collapseDetail.tools" :key="item.name">
        <BMForm :ref="(el: any) => getFormRefs(el, item)" v-bind="formProps" :schemas="getSchemas(item)" />
        <template #header>
          <div class="header">
            <span>{{ item.name }}</span>
            <span class="desc">{{ item.description }}</span>
          </div>
        </template>
      </CollapsePanel>
    </Collapse>
  </NormalModalForm>
</template>

<script lang="tsx" setup>
import type { FormProps, FormSchema, Recordable, RenderCallbackParams } from '@bmos/components';
import { reqAgentToolInvokeMCPServer, reqAgentToolTestMCPServer } from '@/api';
import Editor from '@/components/Editor/index.vue';
import { BMForm, NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Button } from 'ant-design-vue';

defineOptions({
  name: 'ChatModel',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    mcpStr?: string;
  }>(),
  {
    mcpStr: '',
  },
);

const open = defineModel<boolean>('open', {
  default: false,
});

const typeMap = {
  string: 'Input',
  number: 'InputNumber',
};

const formRefs = ref<Recordable>({});
const getFormRefs = (el: any, item: Recordable) => {
  if (el) {
    formRefs.value[item.name] = el;
  }
};

const extractBaseUrl = (data: Recordable): string | null => {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  for (const key in data) {
    if (key === 'baseUrl') {
      return data[key];
    }
    if (typeof data[key] === 'object') {
      const result = extractBaseUrl(data[key]);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

const baseUrl = computed(() => {
  try {
    const parsedData = JSON.parse(props.mcpStr || '{}');
    return extractBaseUrl(parsedData);
  }
  catch (error) {
    console.error('Invalid JSON string:', error);
    return null;
  }
});

// @ts-expect-error
const formProps: Ref<FormProps> = ref({
  layout: 'vertical',
  showAdvancedButton: false,
  showActionButtonGroup: false,
  baseColProps: {
    span: 12,
  },
});

const getSchemas = (item: Recordable) => {
  const schemas: FormSchema[] = [];
  item?.inputSchema?.forEach((schema: Recordable) => {
    const type = schema.type as keyof typeof typeMap;
    schemas.push({
      field: schema.field,
      component: typeMap[type] || 'Input',
      label: schema.description,
      required: schema.required || false,
    });
  });
  schemas.push({
    field: 'testField',
    colProps: {
      span: 24,
    },
    component: ({ formInstance }: RenderCallbackParams) => {
      return (
        <div>
          <Button
            type="primary"
            onClick={() => {
              formInstance.validate().then((values: Recordable) => {
                reqAgentToolInvokeMCPServer({
                  url: baseUrl.value,
                  tool_name: item.name,
                  argument: JSON.stringify(values),
                }).then((res: Recordable) => {
                  formInstance.setFormModel('output', JSON.stringify(res.data, null, 2));
                }).catch((error: any) => {
                  formInstance.setFormModel('output', JSON.stringify(error, null, 2));
                });
              });
            }}
          >
            { t('测试') }
          </Button>
        </div>
      );
    },
    noLabel: true,
  }, {
    field: 'output',
    colProps: {
      span: 24,
    },
    noLabel: true,
    component: ({ formModel }: RenderCallbackParams) => {
      return (
        <div style={{ height: '200px' }}>
          <Editor v-model={formModel.output} language="json" showBorder />
        </div>
      );
    },
  });
  return schemas;
};

const activeKey = ref<string[]>([]);
const collapseDetail = ref<Recordable>({});

watch(
  () => open.value,
  async (val) => {
    if (val) {
      await nextTick();
      try {
        const { data } = await reqAgentToolTestMCPServer({
          tool_json: props.mcpStr,
        });
        collapseDetail.value = data;
      }
      catch (_error) {
        //
      }
      // activeKey.value = collapseDetail.value.tools[0].name;
    }
  },
);
</script>

<style lang="less">
.mcpTestModal {
  .ant-collapse {
    margin-bottom: 20px;
    .header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .desc {
      font-size: 14px;
      color: var(--bmos-third-level-text-color);
    }
  }
}
</style>
