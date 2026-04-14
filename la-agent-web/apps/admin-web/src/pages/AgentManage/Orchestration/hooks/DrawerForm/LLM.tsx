import type { FormSchema, Recordable, RenderCallbackParams } from '@bmos/components';
import type { SelectValue } from 'ant-design-vue/es/select';
import type { RightDrawerProps } from '../../type';
import { reqAgentAgentsLLMList, reqAgentAgentsToolList } from '@/api';
import { FlowNodeEnum } from '@/components/Flow/type';
import { BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { getUUID } from '@bmos/utils';
import { Button } from 'ant-design-vue';
import LLMConfigModal from '../../components/LLMConfigModal.vue';
import Prompts from '../../components/Prompts.vue';
import { PromptsTypeEnum } from '../../type';

export const LLMConfig = (props: RightDrawerProps): FormSchema[] => {
  return [
    {
      field: `${FlowNodeEnum.LLM}_config.id`,
      component: 'Select',
      label: t('模型'),
      required: true,
      colProps: { span: 18 },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.LLM,
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          request: {
            watchFields: ['node_type'],
            options: {
              immediate: true,
            },
            callback: async () => {
              if (formModel.node_type !== FlowNodeEnum.LLM) {
                return [];
              }
              try {
                const { data } = await reqAgentAgentsLLMList();
                return data;
              }
              catch (_error) {
                return [];
              }
            },
          },
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          onClear: () => {
            if (formModel[`${FlowNodeEnum.LLM}_config`]) {
              formModel[`${FlowNodeEnum.LLM}_config`].config = undefined;
            }
            else {
              formModel[`${FlowNodeEnum.LLM}_config`] = {
                config: undefined,
              };
            }
          },
          onChange: (value: SelectValue, option: any) => {
            if (value) {
              try {
                formModel[`${FlowNodeEnum.LLM}_config`].name = option?.name;
                const formData: Recordable = {};
                if (formModel[`${FlowNodeEnum.LLM}_config`]) {
                  formModel[`${FlowNodeEnum.LLM}_config`].config = formData;
                }
                else {
                  formModel[`${FlowNodeEnum.LLM}_config`] = {
                    config: formData,
                  };
                }
              }
              catch (_error) {
              //
              }
            }
          },
        };
      },
    },
    {
      field: `${FlowNodeEnum.LLM}_config.config`,
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <>
            <LLMConfigModal
              v-model:config={formModel[`${FlowNodeEnum.LLM}_config`].config}
            />
          </>
        );
      },
      label: '',
      colProps: {
        span: 6,
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.LLM,
    },
    // 提示词
    {
      field: `${FlowNodeEnum.LLM}_config.prompts`,
      formItemProps: {
        labelCol: { span: 24 },
      },
      labelFullWidth: true,
      disabledLabelWidth: true,
      noLabelTip: true,
      defaultValue: [
        {
          key: getUUID('prompts'),
          type: PromptsTypeEnum.System,
          prompt: undefined,
        },
      ],
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.LLM,
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
            <BMTableTitle title={t('提示词')} />
            <Button
              type="link"
              onClick={() => {
                if (!formModel[`${FlowNodeEnum.LLM}_config`].prompts) {
                  formModel[`${FlowNodeEnum.LLM}_config`].prompts = [{
                    key: getUUID('prompt'),
                    type: PromptsTypeEnum.System,
                    prompt: undefined,
                  }];
                }
                formModel[`${FlowNodeEnum.LLM}_config`].prompts.push({
                  key: getUUID('prompt'),
                  type: PromptsTypeEnum.User,
                  prompt: undefined,
                });
              }}
            >
              {props.isView ? '' : t('添加提示词')}
            </Button>
          </div>
        );
      },
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <Prompts
            v-model:list={formModel[`${FlowNodeEnum.LLM}_config`].prompts}
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
                const materialRef = formInstance?.compRefMap.get('prompts');
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
    {
      field: `${FlowNodeEnum.LLM}_config.tool_ids`,
      component: 'Select',
      label: t('工具'),
      colProps: {
        span: 24,
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.LLM,
      componentProps: ({ formModel }: RenderCallbackParams) => {
        return {
          request: {
            watchFields: ['node_type'],
            options: {
              immediate: true,
            },
            callback: async () => {
              if (formModel.node_type !== FlowNodeEnum.LLM) {
                return [];
              }
              try {
                const { data } = await reqAgentAgentsToolList();
                return data;
              }
              catch (_error) {
                return [];
              }
            },
          },
          mode: 'multiple',
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        };
      },
    },
  ] as FormSchema[];
};
