import type { FormSchema, RenderCallbackParams } from '@bmos/components';
import type { RightDrawerProps } from '../../type';
import { FlowNodeEnum } from '@/components/Flow/type';
import { getUUID } from '@bmos/utils';
import Cases from '../../components/Cases.vue';

export const ConditionConfig = (props: RightDrawerProps): FormSchema[] => {
  return [
    {
      field: `${FlowNodeEnum.CONDITION}_config.cases`,
      defaultValue: [
        {
          key: getUUID('case'),
          conditions: [],
        },
        {
          key: getUUID('case'),
        },
      ],
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <Cases
            v-model:list={formModel[`${FlowNodeEnum.CONDITION}_config`].cases}
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
                const materialRef = formInstance?.compRefMap.get(`${FlowNodeEnum.CONDITION}_config.cases`);
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
      noLabel: true,
      vIf: ({ formModel }: RenderCallbackParams) => formModel.node_type === FlowNodeEnum.CONDITION,
    },
  ];
};
