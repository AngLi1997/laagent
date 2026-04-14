<!-- 知识库管理-详情 -->
<template>
  <BreadcrumbButton>
    <template #breadcrumb>
      <Breadcrumb>
        <breadcrumb-item @click="returnBack">
          {{ t('知识库管理') }}
        </breadcrumb-item>
        <breadcrumb-item>{{ title }}</breadcrumb-item>
      </Breadcrumb>
    </template>
    <template #btns>
      <Button @click="returnBack">
        {{ t('返回') }}
      </Button>
      <Button v-if="optionStatus !== OperationType.View" type="primary" @click="save">
        {{ t('保存') }}
      </Button>
    </template>
    <BMForm ref="formRef" v-bind="formProps" />
  </BreadcrumbButton>
</template>

<script lang="tsx" setup>
import type {
  formInstance,
  FormProps,
  RenderCallbackParams,
  TableColumn,
} from '@bmos/components';
import { reqKnowledgeBaseCreate, reqKnowledgeBaseEdit, reqKnowledgeBaseInfo, reqKnowledgeDocumentCategoryDocumentsTree } from '@/api';
import BreadcrumbButton from '@/components/BreadcrumbButton/index.vue';
import { useWarn } from '@/hooks';
import {
  BMForm,
  BMTable,
  BMTableTitle,
} from '@bmos/components';
import { t } from '@bmos/i18n';
import { findItemByAttr, getNestedValue } from '@bmos/utils';
import { Button, FormItemRest, message, TreeSelect } from 'ant-design-vue';
import { OperationType } from './type';

const route = useRoute();
const router = useRouter();

const returnBack = () => {
  router.push({
    name: 'KnowledgeBase',
  });
};
const formRef = ref<formInstance>();

const dataTreeData = ref<any[]>([]);

const { warnModal } = useWarn();
const deleteRecord = (record: any) => {
  warnModal(t('是否删除该知识库数据'), {
    onOk: () => {
      const formData = formRef.value?.getFormModelByField('document_ids');
      const index = formData.findIndex((item: any) => item.key === record.key);
      formData.splice(index, 1);
      formRef.value?.setFormModel('document_ids', formData);
    },
  });
};
const columns: TableColumn[] = [
  {
    title: t('知识库名称'),
    dataIndex: 'code',
    width: 200,
    customRender: ({ record }: any) => {
      return (
        <div class="editable-cell">
          <TreeSelect
            value={record.code}
            treeDefaultExpandAll
            allowClear={false}
            placeholder={t('知识库名称')}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            treeData={dataTreeData.value}
            disabled={optionStatus.value === OperationType.View}
            onSelect={(value: any, node: any) => {
              record.code = value;
              record.summary = node.summary;
            }}
          />
        </div>
      );
    },
  },
  {
    title: t('文档摘要'),
    dataIndex: 'summary',
    width: 400,
    ellipsis: { showTitle: false },
  },
  {
    title: t('操作'),
    align: 'left',
    key: 'ACTION',
    fixed: 'right',
    width: 100,
    actions: ({ record }: any) => [
      {
        label: t('删除'),
        ifShow: route.query?.status !== OperationType.View,
        danger: true,
        onClick: () => {
          deleteRecord(record);
        },
      },
    ],
  },
];
const getKey = () => Math.random().toString(36).substr(2, 9);
const formProps: Ref<FormProps> = ref({
  baseColProps: {
    span: 8,
  },
  showActionButtonGroup: false,
  schemas: [
    {
      field: 'cargoInfo',
      noLabel: true,
      component: () => {
        return <BMTableTitle title={t('知识库信息')} />;
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: t('知识库名称'),
      required: true,
    },
    {
      field: 'serial',
      component: 'Input',
      label: t('编号'),
      required: true,
    },
    {
      field: 'document_ids',
      noLabel: true,
      colProps: {
        span: 24,
      },
      defaultValue: [],
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_rule: any, value: any) => {
              if (value.length === 0) {
                return Promise.reject(t('文档缺少知识库数据'));
              }
              if (value.some((item: any) => !item.code)) {
                return Promise.reject(t('知识库名称不能为空'));
              }
              return Promise.resolve();
            },
          },
        ];
      },
      component: ({ formModel }: RenderCallbackParams) => {
        return (
          <>
            <FormItemRest>
              <BMTable
                showIndex
                search={false}
                dataSource={formModel.document_ids}
                columns={columns}
                row-key="id"
                pagination={false}
                scroll={{ x: 1200, y: 400 }}
              >
                {{
                  headerTitle: () => {
                    return <BMTableTitle title={t('文档信息')} />;
                  },
                  toolbar: () => {
                    return optionStatus.value !== OperationType.View
                      ? (
                          <Button
                            type="primary"
                            onClick={() => {
                              formModel.document_ids.push({
                                required: 1,
                                key: getKey(),
                              });
                            }}
                          >
                            {t('新增文档')}
                          </Button>
                        )
                      : null;
                  },
                }}
              </BMTable>
            </FormItemRest>
          </>
        );
      },
    },
  ],
});

const title = ref<string>(t('新增知识库'));
const optionStatus = ref<string>(OperationType.Add);

const setDetail = async (id: string) => {
  try {
    const { data } = await reqKnowledgeBaseInfo(id);
    formRef.value?.setFormModels({
      ...data,
      document_ids: data.documents
        .map((item: any) => {
          return {
            ...item,
            code: item.id,
            key: getKey(),
            summary: findItemByAttr(dataTreeData.value, 'id', item.id)?.summary,
          };
        }),
    });
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};

function loopSelectableTree<T extends Record<string, any>>(arr: T[], attr: string): T[] {
  return arr.map((item: any) => {
    if (getNestedValue(item, attr)) {
      item.selectable = true;
    }
    else {
      item.selectable = false;
    }
    if (item.children) {
      loopSelectableTree(item.children, attr);
    }
    if (item.documents && item.documents.length) {
      item.documents.forEach((doc: any) => {
        doc.selectable = true;
      });
      item.children = item.documents;
    }
    return item;
  });
}

const getTree = async () => {
  try {
    const { data } = await reqKnowledgeDocumentCategoryDocumentsTree();
    dataTreeData.value = loopSelectableTree(
      data,
      'summary',
    );
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};
  // 监听路由变化
watch(
  () => route.query,
  async (query: any) => {
    await nextTick();
    const { type, id } = query;
    optionStatus.value = type as string;
    await getTree();
    switch (type) {
      case OperationType.Add:
        title.value = t('新增知识库');
        break;
      case OperationType.Edit:
        title.value = t('编辑知识库');
        setDetail(id);
        break;
      case OperationType.View:
        title.value = t('查看知识库');
        formRef.value?.setFormProps({
          disabled: true,
        });
        setDetail(id);
        break;
    }
  },
  {
    immediate: true,
  },
);
const saveFun = async (params: any) => {
  try {
    if (optionStatus.value === OperationType.Edit) {
      await reqKnowledgeBaseEdit(params);
      message.success(t('保存成功'));
    }
    else {
      await reqKnowledgeBaseCreate(params);
      message.success(t('编辑成功'));
    }
    returnBack();
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
};

const hasDuplicates = (array: any[] = []) => {
  return new Set(array).size !== array.length;
};

const validateGetSaveData = async () => {
  try {
    const formData = await formRef.value?.validate();
    const { document_ids, ...rest } = formData;
    const data = document_ids.map((item: any) => {
      return item.code;
    });
    if (hasDuplicates(data)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('hasDuplicates');
    }
    return { ...rest, document_ids: data, ...(route.query.category_id && { category_id: route.query.category_id }) };
  }
  catch (_error: any) {
  }
};
const save = async () => {
  try {
    const saveData = await validateGetSaveData();
    saveFun(saveData);
  }
  catch (error) {
    if (error === 'hasDuplicates') {
      message.warning(t('知识库中有重复文档，请删除'));
    }
  }
};
</script>

<style lang="less" scoped>
  :deep(.ant-form) {
  flex: 1;
  overflow: auto;
}
</style>
