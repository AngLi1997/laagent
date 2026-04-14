<template>
  <BMModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title
    :form-props="formProps"
    wrap-class-name="modalSizeMedium"
    :submit="submit"
  />
</template>

<script lang="tsx" setup>
import type { FormProps, Recordable, RenderCallbackParams } from '@bmos/components';
import type { UploadProps } from 'ant-design-vue';
import { getAgent, reqAgentCategoryTree, reqAgentFileUpload, reqAgentsCreate, reqAgentsUpdate } from '@/api';
import DepartMent from '@/components/DepartMent/index.vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { BMModalForm, NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Button, message } from 'ant-design-vue';
import { OperationType } from '../type';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    id?: string;
    status?: OperationType;
    categoryId?: string;
  }>(),
  {
    status: OperationType.Add,
    id: '',
    categoryId: undefined,
  },
);

const emit = defineEmits<{
  (e: 'ok'): void;
  (e: 'add', data: any): void;
}>();

const open = defineModel<boolean>('open', {
  default: false,
});

const modalFormRef = ref<InstanceType<typeof BMModalForm>>();
const title = computed(() => {
  return props.status === OperationType.Edit ? t('编辑应用') : t('创建应用');
});

const setDetail = async (id: string) => {
  try {
    const { data } = await getAgent(id);
    const agent = data[0] ?? {};
    modalFormRef.value?.formRef?.setFormModels(agent);
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
watch(
  () => open.value,
  async (val) => {
    if (val) {
      await nextTick();
      if (props.status === OperationType.Edit) {
        setDetail(props.id);
      }
      else {
        modalFormRef.value?.formRef?.setFormModel('category_id', props.categoryId ?? undefined);
      }
    }
  },
);
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
  schemas: [
    {
      field: 'name',
      component: 'Input',
      label: t('应用名称'),
      required: true,
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
    },
    {
      field: 'dept_ids',
      label: t('部门授权'),
      required: true,
      component: ({ formModel, formInstance }: RenderCallbackParams) => {
        return (
          <>
            <NormalModalForm
              title={t('部门授权')}
              submit={async () => {
                const ids = departMentRef.value?.getSelectKeys();
                formModel.dept_ids = ids;
                if (ids?.length) {
                  formInstance.clearValidate(['dept_ids']);
                }
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
            trigger: 'change',
            validator: () => {
              if (!formModel.dept_ids || formModel.dept_ids?.length === 0) {
                return Promise.reject(t('请选择部门授权'));
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
  ],
});

const submit = async (formData: Recordable) => {
  try {
    if (props.status === OperationType.Edit) {
      await reqAgentsUpdate({
        ...formData,
        id: props.id,
      });
    }
    else {
      const { data } = await reqAgentsCreate({
        category_id: formData.category_id,
        name: formData.name,
        description: formData.description,
        icon_url: formData.icon_url,
        dept_ids: formData.dept_ids,
      });
      emit('add', data);
    }
    open.value = false;
    emit('ok');
    return Promise.resolve();
  }
  catch (error: any) {
    error.message && message.error(error.message);
    return Promise.reject(new Error(error.message || 'An unknown error occurred'));
  }
};
</script>

<style scoped lang="less">
.depart-btn {
  display: inline-flex;
  column-gap: 8px;
  align-items: center;
}
</style>
