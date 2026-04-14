import type { FormProps, ModalFormInstance, RenderCallbackParams } from '@bmos/components';
import { doc } from '@/components/RecallTesting/assets/index';
import { Score, Tags } from '@/components/RecallTesting/components/index';
import { Divider } from 'ant-design-vue';

export const useForm = () => {
  const modalFormRef = ref<ModalFormInstance>();

  const formProps = reactive<FormProps>({
    initialValues: {},
    layout: 'horizontal',
    schemas: [
      {
        noLabel: true,
        noFormItemMarginBottom: true,
        field: 'header',
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <Score score={formModel.score} chunkIndex={formModel.chunk_index} contentLen={formModel.contentLen} />
          );
        },
        // style: { marginBottom: '12px' },
      },
      {
        noLabel: true,
        noFormItemMarginBottom: true,
        field: 'divider',
        component: 'Divider',
      },
      {
        noLabel: true,
        noFormItemMarginBottom: true,
        field: 'doc',
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <>
              <img src={doc} style={{ marginRight: '4px' }} />
              <span style={{ color: '#909398', fontSize: '12px' }}>{formModel.docFile}</span>
            </>
          );
        },
      },
      {
        noLabel: true,
        field: 'content',
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <div class="paragraph-content">
              <div style={{ maxHeight: '30vh', overflow: 'auto' }}>{formModel.content}</div>
              <Divider />
              <Tags tags={formModel.keywords} />
            </div>
          );
        },
      },
    ],
  });

  const setFormModels = (values: any) => {
    modalFormRef.value?.formRef?.setFormModels(values);
  };

  return {
    modalFormRef,
    formProps,
    setFormModels,
  };
};
