import type { FormSchema, Recordable, RenderCallbackParams } from '@bmos/components';
import { reqAgentAgentsKBList } from '@/api';
import { FlowNodeEnum } from '@/components/Flow/type';
import RetrievalModal from '@/components/RetrievalModal/index.vue';
import { matchingTypeEnum } from '@/components/RetrievalModal/type';
import { t } from '@bmos/i18n';

export const KbConfig: FormSchema[] = [
  {
    field: `${FlowNodeEnum.KNOWLEDGE_BASE}_config.id`,
    component: 'Select',
    label: t('知识库'),
    required: true,
    colProps: {
      span: 18,
    },
    vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.KNOWLEDGE_BASE,
    componentProps: ({ formModel }: RenderCallbackParams) => {
      return {
        request: {
          watchFields: ['node_type'],
          options: {
            immediate: true,
          },
          callback: async () => {
            if (formModel.node_type !== FlowNodeEnum.KNOWLEDGE_BASE) {
              return [];
            }
            try {
              const { data } = await reqAgentAgentsKBList();
              if (formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].id) {
                formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].name = data.find((item: Recordable) => item.id === formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].id)?.name;
              }
              return data;
            }
            catch (_error) {
              return [];
            }
          },
          onChange: () => {
            formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].config = {
              matching_type: matchingTypeEnum.VECTOR,
              rerank: false,
              top_k: 10,
              score_threshold: 0.5,
            };
          },
        },
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      };
    },
  },
  {
    field: `${FlowNodeEnum.KNOWLEDGE_BASE}_config.config`,
    component: ({ formModel }: RenderCallbackParams) => {
      return (
        <RetrievalModal
          trigger={true}
          triggerProps={{
            triggerButtonText: t('配置'),
            triggerButtonProps: {
              type: 'default',
            },
          }}
          params={formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].config}
          onSaveParams={(params: Recordable) => {
            if (formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`]) {
              formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`].config = params;
            }
            else {
              formModel[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`] = {
                config: params,
              };
            }
          }}
        />
      );
    },
    label: '',
    colProps: {
      span: 6,
    },
    vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.KNOWLEDGE_BASE,
  },
];
