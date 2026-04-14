import type { FormProps, ModalFormInstance, Recordable, RenderCallbackParams } from '@bmos/components';
import type { UploadProps } from 'ant-design-vue';
import { reqAgentFileUpload, reqDocumentCategoryTree, reqDocumentCreate, reqDocumentSplit, reqDocumentUpload } from '@/api';
import DepartMent from '@/components/DepartMent/index.vue';
import { QuestionCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Button, message, Segmented, Tooltip } from 'ant-design-vue';

export const useForm = () => {
  const modalFormRef = ref<ModalFormInstance>();

  const loading = ref(false);

  const previewParagraphRef = ref();

  const loadingPreview = ref(false);

  /**
   * @description 预览分段
   * @param record 表单内容
   */
  const previewParagraph = async (record: any) => {
    loadingPreview.value = true;
    try {
      const { data } = await reqDocumentSplit({
        chunk_identifier: record.chunk_identifier,
        chunk_overlap: record.chunk_overlap,
        chunk_size: record.chunk_size,
        clear_url: record.clear_url,
        document_id: record.document_id,
        trip: record.trip,
        return_size: 10,
      });
      previewParagraphRef.value?.openModal(data?.chunk_list || []);
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
    finally {
      loadingPreview.value = false;
    }
  };

  const formProps = reactive<FormProps>({
    initialValues: {
      chunk_size: 200,
      chunk_overlap: 0,
    },
    labelWidth: 120,
    layout: 'horizontal',
    schemas: [
      {
        label: t('分段标识符'),
        field: 'chunk_identifier',
        colProps: {
          span: 14,
          style: {
            marginRight: 'auto',
          },
        },
        component: 'Input',
      },
      {
        label: t('分段最大长度'),
        field: 'chunk_size',
        required: true,
        colProps: {
          span: 14,
          style: {
            marginRight: 'auto',
          },
        },
        component: 'InputNumber',
        componentProps: {
          style: {
            width: '100%',
          },
        },
      },
      {
        label: t('分段重叠长度'),
        field: 'chunk_overlap',
        required: true,
        colProps: {
          span: 14,
          style: {
            marginRight: 'auto',
          },
        },
        component: 'InputNumber',
        componentProps: {
          style: {
            width: '100%',
          },
        },
      },
      {
        noLabel: true,
        field: 'trip',
        component: 'Checkbox',
        componentSlots: {
          default: () => {
            return t('替换掉连续的空格、换行符和制表符');
          },
        },
      },
      {
        noLabel: true,
        field: 'clear_url',
        component: 'Checkbox',
        componentSlots: {
          default: () => {
            return t('删除所有URL和电子邮件地址');
          },
        },
      },
      {
        noLabel: true,
        field: 'preview',
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <span>
              <Button loading={loadingPreview.value} onClick={() => previewParagraph(formModel)}>
                <SearchOutlined />
                {t('预览分段')}
              </Button>
            </span>
          );
        },
      },
    ],
  });

  const setFormModels = (values: any) => {
    modalFormRef.value?.formRef?.setFormModels(values);
  };

  const updateFormSchemas = (field: string, value: any) => {
    modalFormRef.value?.formRef?.appendSchemasByField(field, value);
  };

  return {
    modalFormRef,
    formProps,
    setFormModels,
    updateFormSchemas,
    previewParagraphRef,
    loading,
  };
};
