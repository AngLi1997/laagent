import type { formInstance, FormProps, RenderCallbackParams } from '@bmos/components';
import type { SelectValue } from 'ant-design-vue/es/select';
import type { RightDrawerProps } from '../type';
import { BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { getUUID } from '@bmos/utils';
import { Button } from 'ant-design-vue';
import InputOutput from '../components/InputOutput.vue';
import { ExceptionTypeEnum } from '../type';
import { ConditionConfig, KbConfig, LLMConfig } from './DrawerForm';
import { ToolConfig } from './DrawerForm/tool';

export interface UseFormParams {
  props: RightDrawerProps;
  emit: any;
  setFormRef: Ref<formInstance> | undefined;
}

export const useDrawerForm = ({ props }: UseFormParams) => {
  // form 是否change
  const isFormChange = ref<boolean>(false);

  const setFormProps: FormProps = {
    disabled: props.isView,
    layout: 'vertical',
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
    schemas: [
      {
        field: 'node_name',
        component: 'Input',
        label: t('节点名称'),
        required: true,
        dynamicRules: ({ formModel }: RenderCallbackParams) => {
          return [
            {
              required: true,
              validator: () => {
                if (formModel.node_name.includes('.')) {
                  return Promise.reject(t('节点名称不允许含有"."'));
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
      // {
      //   field: 'node_type',
      //   component: 'Select',
      //   label: t('节点类型'),
      //   required: true,
      //   componentProps: {
      //     options: LeftMap.map((item) => {
      //       return {
      //         label: item.title,
      //         value: item.shape,
      //       };
      //     }),
      //   },
      // },
      ...LLMConfig(props),
      ...ConditionConfig(props),
      ...KbConfig,
      ...ToolConfig(props),
      // 输入参数
      {
        field: 'inputs',
        formItemProps: {
          labelCol: { span: 24 },
        },
        labelFullWidth: true,
        disabledLabelWidth: true,
        noFormItemMarginBottom: true,
        noLabelTip: true,
        defaultValue: [
          {
            key: getUUID('input'),
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
              <BMTableTitle title={t('节点输入')} />
              <Button
                type="link"
                onClick={() => {
                  if (!formModel.inputs) {
                    formModel.inputs = [];
                  }
                  formModel.inputs.push({
                    key: getUUID('input'),
                  });
                }}
              >
                {props.isView ? '' : t('添加节点输入')}
              </Button>
            </div>
          );
        },
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <InputOutput
              v-model:list={formModel.inputs}
              isView={props.isView}
              allowEmpty={true}
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
                  const materialRef = formInstance?.compRefMap.get('inputs');
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
      // 输出参数
      {
        field: 'outputs',
        formItemProps: {
          labelCol: { span: 24 },
        },
        labelFullWidth: true,
        noFormItemMarginBottom: true,
        disabledLabelWidth: true,
        noLabelTip: true,
        defaultValue: [
          {
            key: getUUID('outputs'),
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
              <BMTableTitle title={t('节点输出')} />
              <Button
                type="link"
                onClick={() => {
                  if (!formModel.outputs) {
                    formModel.outputs = [];
                  }
                  formModel.outputs.push({
                    key: getUUID('outputs'),
                  });
                }}
              >
                {props.isView ? '' : t('添加节点输出')}
              </Button>
            </div>
          );
        },
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <InputOutput
              v-model:list={formModel.outputs}
              isView={props.isView}
              allowEmpty={true}
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
                  const materialRef = formInstance?.compRefMap.get('outputs');
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
        label: t('是否输出到用户'),
        field: 'output_to_user',
        required: true,
        component: 'Switch',
        defaultValue: true,
        componentProps: {
          checkedValue: true,
          unCheckedValue: false,
        },
        dynamicRules() {
          return [
            {
              required: true,
              type: 'boolean',
              message: t('请选择是否输出到用户'),
            },
          ];
        },
      },
      {
        field: 'error_handle.type',
        component: 'Select',
        label: t('异常处理方式'),
        required: true,
        defaultValue: ExceptionTypeEnum.Terminal,
        componentProps: ({ formModel }: RenderCallbackParams) => {
          return {
            options: [
              {
                label: t('终止并输出默认值'),
                value: ExceptionTypeEnum.Terminal,
              },
              {
                label: t('输出默认值并继续执行'),
                value: ExceptionTypeEnum.Continue,
              },
            ],
            onChange: (value: SelectValue, _option: any) => {
              if (value === ExceptionTypeEnum.Continue) {
                if (!formModel.error_handle || !formModel.error_handle?.outputs?.length) {
                  formModel.error_handle = {
                    type: ExceptionTypeEnum.Continue,
                    outputs: [
                      {
                        key: getUUID('error_handle.outputs'),
                      },
                    ],
                  };
                }
                else {
                  formModel.error_handle = {
                    type: ExceptionTypeEnum.Terminal,
                    terminal_message: undefined,
                  };
                }
              }
            },
          };
        },
      },
      {
        field: 'error_handle.terminal_message',
        component: 'InputTextArea',
        label: t('异常默认文本'),
        required: true,
        vIf: ({ formModel }: RenderCallbackParams) => formModel.error_handle?.type === ExceptionTypeEnum.Terminal,
      },
      // 异常处理 输出参数
      {
        field: 'error_handle.outputs',
        formItemProps: {
          labelCol: { span: 24 },
        },
        labelFullWidth: true,
        disabledLabelWidth: true,
        noLabelTip: true,
        vIf: ({ formModel }: RenderCallbackParams) => formModel.error_handle?.type === ExceptionTypeEnum.Continue,
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
              <BMTableTitle title={t('节点输出')} />
              <Button
                type="link"
                onClick={() => {
                  if (!formModel.inputs) {
                    formModel.inputs = [];
                  }
                  formModel.inputs.push({
                    key: getUUID('error_handle.outputs'),
                  });
                }}
              >
                {props.isView ? '' : t('添加节点输出')}
              </Button>
            </div>
          );
        },
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <InputOutput
              v-model:list={formModel.error_handle.outputs}
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
                  const materialRef = formInstance?.compRefMap.get('error_handle.outputs');
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
  };

  return {
    setFormProps,
    isFormChange,
  };
};
