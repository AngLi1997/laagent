<!-- 工具配置-详情 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="returnBack">
          {{ t('工具配置') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ title }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="returnBack">
        {{ t('返回') }}
      </Button>
      <Button v-if="optionStatus !== OperationType.View" type="primary" @click="save">
        {{ t('保存') }}
      </Button>
    </template>
    <div class="container">
      <div class="left">
        <BMForm ref="formRef" v-bind="formProps" />
      </div>
      <div class="right">
        <template v-if="showRestForm">
          <BMForm ref="restFormRef" v-bind="restFormProps" />
          <Button class="test-btn" type="primary" @click="testApi">
            {{ t('接口测试') }}
          </Button>
        </template>
        <template v-else>
          <Button class="test-btn" type="primary" @click="testMCP">
            {{ t('测试') }}
          </Button>
          <Editor v-model="editorValue" :language="editorLng" :read-only="isView" />
        </template>
      </div>
    </div>
  </BreadcrumbButton>
  <PermissionDeptModal
    v-model:permission-open="permissionDeptModalOpen"
    :save-immediate="false"
    :is-add="true"
    :type="false"
    @ok="savePermissionDept"
  />
  <TestApiModal v-model:test-modal-open="testApiModal" :test-api-data />
  <MCPTestModal v-model:open="testMCPModal" :mcp-str="editorValue" />
</template>

<script lang="tsx" setup>
import type { formInstance, FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import { reqAgentToolCreate, reqAgentToolsFind, reqAgentToolsUpdate } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import Editor from '@/components/Editor/index.vue';
import PermissionDeptModal from '@/components/PermissionDept/index.vue';
import { BMForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { getUUID } from '@bmos/utils';
import { Button, message, Upload } from 'ant-design-vue';
import MCPTestModal from './components/MCPTestModal.vue';
import ParamsTable from './components/ParamsTable.vue';
import TestApiModal from './components/TestApiModal.vue';
import { OperationType, ToolType } from './type';

const route = useRoute();
const router = useRouter();

const returnBack = () => {
  router.push({
    name: 'ToolConfig',
  });
};

const formRef = ref<formInstance>();

const editorValue = ref<string>('');
const editorLng = ref<string>('json');
const initEditor = (type: ToolType, content?: string) => {
  editorValue.value = content || '';
  showRestForm.value = false;
  switch (type) {
    case ToolType.Python:
      editorLng.value = 'python';
      break;
    case ToolType.MCP:
      editorLng.value = 'json';
      break;
    case ToolType.Rest:
      editorLng.value = 'yaml';
      showRestForm.value = true;
      break;
    default:
      editorLng.value = 'json';
      break;
  }
};

const showRestForm = ref<boolean>(false);

const formProps: Ref<FormProps> = ref({
  baseColProps: {
    span: 24,
  },
  showActionButtonGroup: false,
  schemas: [
    {
      field: 'name',
      component: 'Input',
      label: t('工具名称'),
      required: true,
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: t('工具描述'),
    },
    {
      field: 'type',
      component: 'Select',
      label: t('工具类型'),
      required: true,
      componentProps: {
        allowClear: false,
        options: [
          { label: t('REST接口'), value: ToolType.Rest },
          { label: t('Python脚本'), value: ToolType.Python },
          { label: t('MCP协议'), value: ToolType.MCP },
        ],
        onChange: (value: string) => {
          initEditor(value as ToolType);
        },
      },
    },
    {
      field: 'upload',
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <div class="upload-component">
            {formModel.type === ToolType.MCP ? t('导入协议') : t('导入脚本')}
            <Upload
              accept={formModel.type === ToolType.MCP ? '.json' : '.py'}
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const content = e.target?.result as string;
                  editorValue.value = content;
                  showRestForm.value = false;
                };
                reader.readAsText(file);
                return false;
              }}
              maxCount={1}
              class="upload-btn"
            >
              <Button type="primary">{t('上传文件')}</Button>
            </Upload>
          </div>
        );
      },
      vIf: ({ formModel }: RenderCallbackParams) =>
        formModel.type === ToolType.Python || formModel.type === ToolType.MCP,
      noLabel: true,
    },
  ],
});

// 创建添加参数的函数
const addParam = (formModel: any) => {
  formModel.params.push({ required: true, key: getUUID('params') });
};
const restFormRef = ref<formInstance>();
const restFormProps: Ref<FormProps> = ref({
  baseColProps: {
    span: 13,
  },
  showActionButtonGroup: false,
  schemas: [
    {
      field: 'requestInfo',
      label: t('请求信息'),
      component: 'TableTitle',
    },
    {
      field: 'method',
      component: 'Select',
      label: t('请求方式/method'),
      required: true,
      componentProps: {
        options: [
          { label: t('GET'), value: 'GET' },
          { label: t('POST'), value: 'POST' },
          { label: t('PUT'), value: 'PUT' },
          { label: t('DELETE'), value: 'DELETE' },
        ],
      },
    },
    {
      field: 'url',
      component: 'Input',
      label: t('请求地址/url'),
      required: true,
    },
    {
      field: 'content_type',
      component: 'Select',
      label: t('内容形式/contentType'),
      required: true,
      componentProps: {
        options: [
          { label: t('application/json'), value: 'application/json' },
          { label: t('application/x-www-form-urlencoded'), value: 'application/x-www-form-urlencoded' },
          { label: t('multipart/form-data'), value: 'multipart/form-data' },
        ],
      },
    },
    {
      field: 'params',
      component: ({ formModel }: RenderCallbackParams) => {
        return <ParamsTable v-model={formModel.params} />;
      },
      colProps: {
        span: 24,
      },
      defaultValue: [],
      label: ({ formModel }: RenderCallbackParams) => {
        return (
          <div class="condition-label">
            {t('输入参数')}
            <Button type="link" onClick={() => addParam(formModel)}>
              {t('添加参数')}
            </Button>
          </div>
        );
      },
      required: true,
    },
    {
      field: 'response_fields',
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <div style={{ height: '180px', width: '100%' }}>
            <Editor v-model={formModel.response_fields} language="json" showBorder />
          </div>
        );
      },
      colProps: {
        span: 24,
      },
      label: t('输出格式'),
      required: true,
    },
  ],
});

const title = ref<string>(t('新增工具'));
const optionStatus = ref<string>(OperationType.Add);

const getDetail = async (id: string) => {
  try {
    const { data } = await reqAgentToolsFind(id);
    if (data) {
      formRef.value?.setFormModels({
        ...data,
      });
      initEditor(data.type, data.mcpAttr);
      await nextTick();
      if (data.type === ToolType.Rest) {
        restFormRef.value?.setFormModels({
          ...data.restAttr,
        });
      }
    }
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};

const isView = ref<boolean>(false);

// 监听路由变化
watch(
  () => route.query,
  async (query: any) => {
    await nextTick();
    const { status, id } = query;
    optionStatus.value = status as string;
    isView.value = status === OperationType.View;
    switch (status) {
      case OperationType.Add:
        title.value = t('新增工具');
        break;
      case OperationType.Edit:
        title.value = t('编辑工具');
        await getDetail(id as string);
        break;
      case OperationType.View:
        title.value = t('工具详情');
        await getDetail(id as string);
        formRef.value?.setFormProps({
          disabled: true,
        });
        restFormRef.value?.setFormProps({
          disabled: true,
        });
        break;
    }
  },
  {
    immediate: true,
  },
);
const permissionDeptModalOpen = ref<boolean>(false);
const saveFun = async (params: any) => {
  try {
    if (optionStatus.value === OperationType.Add) {
      await reqAgentToolCreate(params);
    }
    else {
      await reqAgentToolsUpdate(params);
    }
    message.success(t('保存成功'));
    returnBack();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
const validateGetSaveData = async () => {
  const formData = await formRef.value?.validate();
  if (formData.type === ToolType.Rest) {
    const restFormData = await restFormRef.value?.validate();
    return {
      ...formData,
      attribute: JSON.stringify(restFormData),
    };
  }
  else {
    return {
      ...formData,
      attribute: editorValue.value,
    };
  }
};
const savePermissionDept = async (dept_ids: any[]) => {
  try {
    const saveData = await validateGetSaveData();
    saveFun({
      ...saveData,
      dept_ids,
    });
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
const save = async () => {
  const saveData = await validateGetSaveData();
  if (optionStatus.value === OperationType.Add) {
    permissionDeptModalOpen.value = true;
  }
  else {
    saveFun({
      ...saveData,
      id: route.query.id,
    });
  }
};

// 接口测试
const testApiModal = ref<boolean>(false);
const testApiData = ref<Recordable>({});
const testApi = async () => {
  try {
    const restFormData = await restFormRef.value?.validate();
    testApiData.value = restFormData;
    testApiModal.value = true;
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};

const testMCPModal = ref<boolean>(false);
const testMCP = async () => {
  try {
    if (!editorValue.value) {
      message.error(t('请先输入MCP配置'));
      return;
    }
    testMCPModal.value = true;
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
  position: relative;
}
.left {
  width: 455px;
  min-width: 455px;
  height: 100%;
  border-right: 1px solid var(--bmos-second-level-border-color);
  padding: 0 12px 0 0;
  overflow: hidden;
  overflow-y: auto;
}
.right {
  flex: 1;
  height: 100%;
  overflow: hidden;
  padding: 0 0 12px 12px;
  overflow-y: auto;
}
.test-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}
:deep(.upload-component) {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}
:deep(.condition-label) {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
