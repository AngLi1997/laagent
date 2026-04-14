import type { FormSchema, Recordable, RenderCallbackParams } from '@bmos/components';
import type { RightDrawerProps } from '../../type';
import { reqAgentAgentsToolList, reqAgentToolTestMCPServer } from '@/api';
import { FlowNodeEnum } from '@/components/Flow/type';
import { BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { getUUID } from '@bmos/utils';
import { Button } from 'ant-design-vue';
import ToolConfigItem from '../../components/ToolConfig.vue';

export const ToolConfig = (props: RightDrawerProps): FormSchema[] => {
  return [
    {
      field: `${FlowNodeEnum.TOOL}_config.id`,
      component: 'Select',
      label: t('工具'),
      required: true,
      colProps: {
        span: 24,
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.TOOL,
      componentProps: ({ formModel, formInstance }: RenderCallbackParams) => {
        return {
          request: {
            watchFields: ['node_type'],
            options: {
              immediate: true,
            },
            callback: async () => {
              if (formModel.node_type !== FlowNodeEnum.TOOL) {
                return [];
              }
              try {
                const { data } = await reqAgentAgentsToolList();
                if (formModel[`${FlowNodeEnum.TOOL}_config`].id) {
                  const item = data.find((item: Recordable) => item.id === formModel[`${FlowNodeEnum.TOOL}_config`].id);
                  if (item) {
                    formModel[`${FlowNodeEnum.TOOL}_config`].name = data.find((item: Recordable) => item.id === formModel[`${FlowNodeEnum.TOOL}_config`].id)?.name;
                    if (item.type === 'MCP') {
                      reqAgentToolTestMCPServer({
                        tool_json: item.mcp_json,
                      }).then(({ data }: any) => {
                        formInstance.appendSchemasByField([{
                          field: `${FlowNodeEnum.TOOL}_config.tool_name`,
                          component: 'Select',
                          label: t('工具名称'),
                          required: true,
                          vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.TOOL,
                          componentProps: {
                            options: data.tools,
                            fieldNames: {
                              label: 'name',
                              value: 'name',
                            },
                          },
                        }], `${FlowNodeEnum.TOOL}_config.id`);
                      });
                    }
                  }
                }
                return data;
              }
              catch (_error) {
                return [];
              }
            },
          },
          onClear: () => {
            formInstance.removeSchemaByFiled(`${FlowNodeEnum.TOOL}_config.tool_name`, true);
            formModel[`${FlowNodeEnum.TOOL}_config`].tool_name = undefined;
          },
          onSelect: (_: any, option: any) => {
            formModel[`${FlowNodeEnum.TOOL}_config`].config = {
              tool_params: [{ key: getUUID('tool_params') }],
              settings: [{ key: getUUID('tool_settings') }],
            };
            formModel[`${FlowNodeEnum.TOOL}_config`].tool_name = undefined;
            if (option.type === 'MCP') {
              reqAgentToolTestMCPServer({
                tool_json: option.mcp_json,
              }).then(({ data }: any) => {
                formInstance.appendSchemasByField([{
                  field: `${FlowNodeEnum.TOOL}_config.tool_name`,
                  component: 'Select',
                  label: t('工具名称'),
                  required: true,
                  vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.TOOL,
                  componentProps: {
                    options: data.tools,
                    fieldNames: {
                      label: 'name',
                      value: 'name',
                    },
                  },
                }], `${FlowNodeEnum.TOOL}_config.id`);
              });
            }
            else {
              formInstance.removeSchemaByFiled(`${FlowNodeEnum.TOOL}_config.tool_name`, true);
            }
          },
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        };
      },
    },
    {
      field: `${FlowNodeEnum.TOOL}_config.config.tool_params`,
      formItemProps: {
        labelCol: { span: 24 },
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.TOOL,
      labelFullWidth: true,
      disabledLabelWidth: true,
      noFormItemMarginBottom: true,
      noLabelTip: true,
      defaultValue: [{
        key: getUUID('tool'),
      }],
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
            <BMTableTitle title={t('工具参数')} />
            <Button
              type="link"
              onClick={() => {
                if (!formModel[`${FlowNodeEnum.TOOL}_config`].config) {
                  formModel[`${FlowNodeEnum.TOOL}_config`].config = [{
                    tool_params: [],
                  }];
                }
                formModel[`${FlowNodeEnum.TOOL}_config`].config.tool_params.push({
                  key: getUUID('tool'),
                });
              }}
            >
              {props.isView ? '' : t('添加工具参数')}
            </Button>
          </div>
        );
      },
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <ToolConfigItem
            v-model:list={formModel[`${FlowNodeEnum.TOOL}_config`].config.tool_params}
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
                const toolRef = formInstance?.compRefMap.get(`${FlowNodeEnum.TOOL}_config.config.tool_params`);
                await toolRef?.validateForm();
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
      field: `${FlowNodeEnum.TOOL}_config.config.settings`,
      formItemProps: {
        labelCol: { span: 24 },
      },
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.TOOL,
      labelFullWidth: true,
      noFormItemMarginBottom: true,
      disabledLabelWidth: true,
      noLabelTip: true,
      defaultValue: [{
        key: getUUID('tool'),
      }],
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
            <BMTableTitle title={t('工具配置')} />
            <Button
              type="link"
              onClick={() => {
                if (!formModel[`${FlowNodeEnum.TOOL}_config`].config) {
                  formModel[`${FlowNodeEnum.TOOL}_config`].config = [{
                    settings: [],
                  }];
                }
                formModel[`${FlowNodeEnum.TOOL}_config`].config.settings.push({
                  key: getUUID('tool'),
                });
              }}
            >
              {props.isView ? '' : t('添加工具配置')}
            </Button>
          </div>
        );
      },
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <ToolConfigItem
            v-model:list={formModel[`${FlowNodeEnum.TOOL}_config`].config.settings}
            isParams={false}
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
                const toolRef = formInstance?.compRefMap.get(`${FlowNodeEnum.TOOL}_config.config.settings`);
                await toolRef?.validateForm();
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
  ];
};
