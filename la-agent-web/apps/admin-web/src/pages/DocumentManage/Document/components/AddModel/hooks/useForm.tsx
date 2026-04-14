import type { FormProps, ModalFormInstance, Recordable, RenderCallbackParams } from '@bmos/components';
import type { UploadProps } from 'ant-design-vue';
import { reqAgentFileUpload, reqDocumentCategoryTree } from '@/api';
import DepartMent from '@/components/DepartMent/index.vue';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Button, message, Segmented, Tooltip } from 'ant-design-vue';

/**
 * 添加方式枚举
 * @enum {number} UPLOAD_FILE--上传文件
 * @enum {number} ONLINE_EDIT--在线编辑
 */
export enum AddWayEnum {
  /**
   * @description 上传文件
   */
  UPLOAD_FILE = 1,
  /**
   * @description 在线编辑
   */
  ONLINE_EDIT = 2,
}

export const useForm = () => {
  const modalFormRef = ref<ModalFormInstance>();

  const loading = ref(false);

  const customRequest: UploadProps['customRequest'] = async (options: any) => {
    try {
      const formData = new FormData();
      // formData.append('dept_ids', `\"${formModal.dept_ids}\"`);
      formData.append('file', options.file);
      const { data } = await reqAgentFileUpload(formData);
      setFormModels({ document_url: data });
      options.onSuccess(data as any);
    }
    catch (error: any) {
      options.onError(error);
      setFormModels({
        record: [],
      });
      error.message && message.error(error.message);
    }
  };

  const departMentRef = ref<InstanceType<typeof DepartMent>>();

  const departIconRender = (model: Recordable) => {
    const style_icon = {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      verticalAlign: 'sub',
    };
    if (!model.dept_ids || model.dept_ids?.length === 0) {
      return h(BMIcons, {
        icon: 'Depart',
        style: style_icon,
      });
    }
    else {
      return h(BMIcons, {
        icon: 'Success',
        style: style_icon,
      });
    }
  };

  const formProps = reactive<FormProps>({
    initialValues: {
      addWay: AddWayEnum.UPLOAD_FILE,
    },
    labelWidth: 120,
    layout: 'horizontal',
    schemas: [
      {
        label: t('文档分类'),
        field: 'category_id',
        required: true,
        colProps: {
          span: 12,
        },
        component: 'TreeSelect',
        componentProps: {
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id',
          },
          request: async () => {
            const { data } = await reqDocumentCategoryTree();
            return data;
          },
        },
      },
      {
        label: t('文档名称'),
        field: 'name',
        required: true,
        colProps: {
          span: 12,
        },
        component: 'Input',
        componentProps: {
          maxlength: 30,
          showCount: true,
        },
      },
      {
        label: t('文档编号'),
        field: 'serial',
        required: true,
        colProps: {
          span: 12,
        },
        component: 'Input',
        componentProps: {
          maxlength: 30,
          showCount: true,
        },
      },
      {
        field: 'dept_ids',
        label: t('部门授权'),
        required: true,
        colProps: {
          span: 12,
        },
        component: ({ formModel }: RenderCallbackParams) => {
          return (
            <>
              <NormalModalForm
                title={t('部门授权')}
                submit={async () => {
                  const ids = departMentRef.value?.getSelectKeys();
                  formModel.dept_ids = ids;
                  return Promise.resolve();
                }}
              >
                {{
                  default: () => (
                    <DepartMent
                      ref={departMentRef}
                      checks={formModel.dept_ids}
                      type={false}
                      isAdd={true}
                    >
                    </DepartMent>
                  ),
                  trigger: () => (
                    <Button icon={departIconRender(formModel)} class="depart-btn">
                      {t('选择部门')}
                    </Button>
                  ),
                }}
              </NormalModalForm>
            </>
          );
        },
        dynamicRules: ({ formModel }: RenderCallbackParams) => {
          return [
            {
              required: true,
              validator: () => {
                if (!formModel.dept_ids || formModel.dept_ids?.length === 0) {
                  return Promise.reject(t('请选择部门授权'));
                }
                return Promise.resolve();
              },
              trigger: 'change',
            },
          ];
        },
      },
      {
        label: t('新增方式'),
        field: 'addWay',
        required: true,
        colProps: {
          span: 12,
          style: {
            marginRight: 'auto',
          },
        },
        component: ({ formModel }: { formModel: Recordable }) => {
          return (
            <Segmented
              value={formModel.addWay}
              block
              options={[
                { label: t('上传文件'), value: AddWayEnum.UPLOAD_FILE },
                { label: t('在线编辑'), value: AddWayEnum.ONLINE_EDIT },
              ]}
              onChange={() => {
                setFormModels({
                  record: [],
                  content: '',
                  document_url: '',
                });
              }}
            />
          );
        },
      },
      {
        label: t('上传记录'),
        field: 'record',
        required: true,
        colProps: {
          span: 12,
        },
        vIf: ({ formModel }: RenderCallbackParams) =>
          (!formModel.addWay || formModel.addWay === AddWayEnum.UPLOAD_FILE),
        component: 'Upload',
        componentProps: () => {
          return {
            accept: '.pdf, .xlsx, .xls, .xlsm, .doc, .docx, .txt, .ppt, .pptx, .tf, .md',
            maxCount: 1,
            customRequest,
            showUploadList: true,
          };
        },
        componentSlots: {
          default: () => {
            return (
              <>
                <Button type="default" style={{ marginRight: '6px' }}>
                  <UploadOutlined></UploadOutlined>
                  {t('上传记录')}
                </Button>
                {/* tip */}
                <Tooltip placement="right" title={t('上传文件格式: .pdf, .xlsx, .xls, .xlsm, .doc, .docx, .txt, .ppt, .pptx, .tf, .md')}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </>
            );
          },
        },
      },
      {
        label: t('文档内容'),
        field: 'content',
        required: true,
        vIf: ({ formModel }: RenderCallbackParams) =>
          (formModel.addWay === AddWayEnum.ONLINE_EDIT),
        component: 'InputTextArea',
        useMaxLengthRule: false,
        componentProps: {
          rows: 7,
          showCount: true,
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
    loading,
  };
};
