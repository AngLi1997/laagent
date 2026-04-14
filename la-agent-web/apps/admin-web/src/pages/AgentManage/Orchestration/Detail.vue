<!-- Agent 编排-详情 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="returnBack">
          {{ t('Agent 编排') }}
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
      <div v-show="isView" class="left">
        <BMForm ref="formRef" v-bind="formProps" />
      </div>
      <div class="right">
        <Flow
          ref="flowInstance"
          :envs="envs"
          :modal-json="modalJson"
          :is-view="isView"
          v-bind="isViewFlowToolBarAttr"
          :left-map="LeftMap"
          class="flow"
          @handle-click-set="handleClickSet"
          @handle-click-test="handleClickTest"
        />
      </div>
    </div>
  </BreadcrumbButton>
  <RightDrawer
    v-model:open="openDrawer"
    :node-id="settingNodeId"
    :node-form-data="settingNodeFormData"
    :nodes-detail="settingNodesDetail"
    :is-view="isView"
    :flow-data-for-drawer="flowDataForDrawer"
    @update-form-value="updateFormValue"
  />
  <TestToolModal
    v-model:test-modal-open="toolTestModal"
    :test-tool-data="testToolData"
  />
  <KnowledgeBaseTest
    :id="knowledgeBaseTestId"
    v-model:knowledge-base-test-open="knowledgeBaseTestModal"
  />
  <ChatModel v-model:open="llmTestModel" :query="llmTestQuery" />
</template>

<script lang="tsx" setup>
import type { Cell } from '@antv/x6';
import type {
  formInstance,
  FormProps,
  RenderCallbackParams,
} from '@bmos/components';
import type { UploadProps } from 'ant-design-vue';
import { getAgent, reqAgentCategoryTree, reqAgentFileUpload, reqAgentsUpdate } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import ChatModel from '@/components/ChatModel/index.vue';
import Flow from '@/components/Flow';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  BMForm,
} from '@bmos/components';
import { t } from '@bmos/i18n';
import { isEmpty } from '@bmos/utils';
import { Button, message } from 'ant-design-vue';
import KnowledgeBaseTest from './components/KnowledgeBaseTest.vue';
import RightDrawer from './components/RightDrawer.vue';
import TestToolModal from './components/TestToolModal.vue';
import { LeftMap } from './const';
import { useFlow } from './hooks';
import { OperationType } from './type';
import { getNodeFormData, handelEdgeData, handelNodeData } from './utils';

const route = useRoute();
const router = useRouter();

const returnBack = () => {
  router.push({
    name: 'Orchestration',
  });
};

const formRef = ref<formInstance>();

const customRequest: UploadProps['customRequest'] = (options: any) => {
  const formData = new FormData();
  formData.append('file', options.file);
  reqAgentFileUpload(formData)
    .then((res: any) => {
      options.onSuccess(res.data as any);
    })
    .catch((error: any) => {
      error.message && message.error(error.message);
      options.onError(error);
    });
};

const formProps: Ref<FormProps> = ref({
  baseColProps: {
    span: 24,
  },
  showActionButtonGroup: false,
  schemas: [
    {
      field: 'name',
      component: 'Input',
      label: t('应用名称'),
      required: true,
      componentProps: () => {
        return {
          onChange: () => {
            isSave.value = false;
          },
        };
      },
    },
    {
      field: 'category_id',
      component: 'TreeSelect',
      required: true,
      label: t('应用分类'),
      componentProps: () => {
        return {
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          showSearch: true,
          treeNodeFilterProp: 'name',
          request: async () => {
            const { data } = await reqAgentCategoryTree();
            return data;
          },
          onChange: () => {
            isSave.value = false;
          },
        };
      },
    },
    {
      field: 'avatar',
      component: 'Upload',
      label: t('应用图标'),
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          accept: '.img ,.png ,.jpg, .jpeg, .gif, .bmp, .webp, .svg, .ico, .gif',
          maxCount: 1,
          showUploadList: false,
          customRequest,
          onChange: (info: any) => {
            formModel.fileList = info.fileList;
            if (info.file.status === 'done') {
              formModel.icon_url = info.file.response;
            }
            else {
              formModel.icon_url = undefined;
            }
          },
        };
      },
      componentSlots: {
        default: ({ values }: any) => {
          const { fileList, icon_url } = values;
          const file = fileList?.[0] || {};
          return (
            <>
              {
                icon_url
                  ? (
                      <img
                        src={icon_url}
                        alt="avatar"
                        style={{
                          height: '80px',
                          width: '80px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      />
                    )
                  : (
                      <div style={{
                        height: '80px',
                        width: '80px',
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        border: '1px dashed #d9d9d9',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                      >
                        {file.status === 'uploading'
                          ? (
                              <LoadingOutlined />
                            )
                          : (
                              <PlusOutlined />
                            )}
                        <div class="ant-upload-text">{t('上传')}</div>
                      </div>
                    )
              }
            </>
          );
        },
      },
    },
    {
      field: 'description',
      component: 'Input',
      label: t('应用描述'),
      componentProps: () => {
        return {
          onChange: () => {
            isSave.value = false;
          },
        };
      },
    },
  ],
});

const title = ref<string>(t('新增应用'));
const optionStatus = ref<string>(OperationType.Add);
const isView = ref<boolean>(false);
const isSave = ref<boolean>(true);
const settingNodesDetail = ref<any>([]);

const {
  envs,
  isViewFlowToolBarAttr,
  flowInstance,
  modalJson,
  openDrawer,
  settingNodeId,
  settingNodeFormData,
  flowDataForDrawer,
  updateFormValue,
  handleClickSet,

  // 测试
  toolTestModal,
  testToolData,

  knowledgeBaseTestModal,
  knowledgeBaseTestId,

  llmTestModel,
  llmTestQuery,
  handleClickTest,
} = useFlow({
  isView,
  isSave,
});

const detailData = ref<any>({});
const setDetail = async (id: string) => {
  try {
    const { data } = await getAgent(id);
    const agent = data[0] ?? {};
    formRef.value?.setFormModels(agent);
    detailData.value = agent;
    if (isEmpty(agent.args)) {
      return;
    }
    const args = JSON.parse(agent.args ?? '{}');
    envs.value = args.envs ?? [];
    const nodesJson = args.nodes?.map((item: any) => {
      const styles = JSON.parse(item.styles);
      return {
        ...styles,
        data: {
          ...styles.data,
          formData: getNodeFormData(item),
        },
      };
    }) ?? [];
    const edgeJson = args.edges?.map((item: any) => {
      const styles = JSON.parse(item.styles);
      return {
        ...styles,
      };
    }) ?? [];
    modalJson.value = [...nodesJson, ...edgeJson];
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};

// 监听路由变化
watch(
  () => route.query,
  async (query: any) => {
    await nextTick();
    const { status, id } = query;
    optionStatus.value = status as string;
    switch (status) {
      case OperationType.Edit:
        title.value = t('编辑应用');
        isView.value = false;
        setDetail(id);
        break;
      case OperationType.View:
        title.value = t('查看应用');
        isView.value = true;
        formRef.value?.setFormProps({
          disabled: true,
        });
        setDetail(id);
        break;
    }
  },
  {
    immediate: true,
  },
);

const saveFun = async (params: any) => {
  try {
    await reqAgentsUpdate(params);
    message.success(t('保存成功'));
    returnBack();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
const validateGetSaveData = async () => {
  const flowData = flowInstance.value.getFlowData() as {
    cells: Cell.Properties[];
  };
  const nodeFlow = handelNodeData(flowData);
  const edgeFlow = handelEdgeData(flowData);
  return {
    ...detailData.value,
    args: JSON.stringify({
      envs: flowInstance.value.envs,
      nodes: nodeFlow,
      edges: edgeFlow,
    }),
  };
};
const save = async () => {
  try {
    const saveData = await validateGetSaveData();
    if (optionStatus.value !== OperationType.Add) {
      saveFun({
        ...saveData,
        id: route.query.id,
      });
    }
    else {
      saveFun(saveData);
    }
  }
  catch (_error: any) {
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
}
.left {
  width: 300px;
  min-width: 300px;
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
  position: relative;
  overflow-y: auto;
  .flow {
    flex: 1;
  }
}
</style>
