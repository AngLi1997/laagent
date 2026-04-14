import type { Cell } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import { ConversationType } from '@/components/ChatModel/type';
import { BaseNode, FlowNodeEnum } from '@/components/Flow/type';
import { t } from '@bmos/i18n';
import { deepMerge, isEmpty } from '@bmos/utils';
import { message } from 'ant-design-vue';
import { handelNodeData } from '../utils';

interface UseFlowParams {
  isView: Ref<boolean>;
  isSave: Ref<boolean>;
}
export const useFlow = ({
  isView,
  isSave,
}: UseFlowParams) => {
  const flowInstance = ref<any>();
  const modalJson = ref<any>([]);
  const envs = ref<Recordable[]>([]);
  const isViewFlowToolBarAttr = computed(() => {
    return isView.value
      ? {
          showUndo: false,
          isView: true,
          isTransform: false,
          showRedo: false,
          showDelete: false,
          isShowLeftToolBar: false,
        }
      : {};
  });

  const openDrawer = ref<boolean>(false);
  const settingNodeId = ref<string>('');
  const settingNodeFormData = ref<Recordable>({});
  const flowDataForDrawer = ref<Recordable[]>([]);
  const handleClickSet = (cell: Cell) => {
    settingNodeId.value = cell.id;
    settingNodeFormData.value = cell.data?.formData || {
      node_name: cell.data.label,
      node_type: cell.data.shape,
    };
    const flowData = flowInstance.value?.getFlowData() as {
      cells: Cell.Properties[];
    };
    flowDataForDrawer.value = handelNodeData(flowData, [])?.filter((item: any) => {
      return BaseNode.includes(item.shape) && item.id !== cell.id;
    });
    openDrawer.value = true;
  };

  const updateFormValue = (id: string, data: Recordable) => {
    try {
      isSave.value = false;
      flowInstance.value?.updateCellData(id, data);
      const cellData = flowInstance.value?.getCellDataById(id);
      settingNodeFormData.value = deepMerge(isEmpty(cellData.formData) ? {} : cellData.formData, data);
    }
    catch (_error) { }
  };

  // 工具测试弹窗
  const toolTestModal = ref<boolean>(false);
  const testToolData = ref<Recordable>({});

  // 知识库测试弹窗
  const knowledgeBaseTestModal = ref<boolean>(false);
  const knowledgeBaseTestId = ref<string>('');

  // LLM测试弹窗
  const llmTestModel = ref<boolean>(false);
  const llmTestQuery = ref<Recordable>({});

  // 点击测试
  const handleClickTest = (cell: Cell, shape: FlowNodeEnum) => {
    switch (shape) {
      case FlowNodeEnum.TOOL:
        toolTestModal.value = true;
        if (cell.data?.formData?.[`${FlowNodeEnum.TOOL}_config`]?.id) {
          toolTestModal.value = true;
          testToolData.value = cell.data?.formData?.[`${FlowNodeEnum.TOOL}_config`].config || {};
        }
        else {
          message.warning(t('请先配置工具'));
        }
        break;
      case FlowNodeEnum.LLM:
        if (cell.data?.formData?.[`${FlowNodeEnum.LLM}_config`]?.id) {
          llmTestModel.value = true;
          llmTestQuery.value = {
            modelId: cell.data?.formData?.[`${FlowNodeEnum.LLM}_config`]?.id,
            type: ConversationType.conversation,
            canLike: false,
          };
        }
        else {
          message.warning(t('请先配置模型'));
        }
        break;
      case FlowNodeEnum.KNOWLEDGE_BASE:
        if (cell.data?.formData?.[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`]?.id) {
          knowledgeBaseTestModal.value = true;
          knowledgeBaseTestId.value = cell.data?.formData?.[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`]?.id;
        }
        else {
          message.warning(t('请先配置知识库'));
        }
        break;
      default:
        break;
    }
  };

  return {
    envs,
    isViewFlowToolBarAttr,
    flowInstance,
    modalJson,
    openDrawer,
    settingNodeId,
    settingNodeFormData,
    flowDataForDrawer,
    handleClickSet,
    updateFormValue,

    // 测试
    toolTestModal,
    testToolData,
    knowledgeBaseTestModal,
    knowledgeBaseTestId,
    handleClickTest,
    llmTestModel,
    llmTestQuery,
  };
};
