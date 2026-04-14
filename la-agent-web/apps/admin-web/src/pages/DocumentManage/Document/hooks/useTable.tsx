import type { ActionListItem, ActionListItemCustomRenderParams, FormProps, Recordable, TableColumn } from '@bmos/components';
import type { DataNode } from 'ant-design-vue/es/tree';
import { reqDocumentCategoryCreate, reqDocumentCategoryRemove, reqDocumentCategoryTree, reqDocumentCategoryUpdate, reqDocumentDelete, reqDocumentDisable, reqDocumentEnable } from '@/api';
import { useWarn } from '@/hooks';
import { usePermissionStore } from '@/stores/permission';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { t } from '@bmos/i18n';
import { message, Modal, Switch } from 'ant-design-vue';
import { createVNode } from 'vue';
import { OperationType, StatusType } from '../type';

export const useTable = () => {
  const pageRef = ref<any>(null);

  const { hasPermission } = usePermissionStore();

  const { warnModal } = useWarn();

  const router = useRouter();

  const firstRowData = ref<any>({});
  const bindProcessModalOpen = ref<boolean>(false);

  const checkedProcessIds = ref<string[]>([]);

  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };

  // 启用状态改变
  const updateStatus = async (record: Recordable) => {
    try {
      warnModal(record.status === StatusType.Enable ? t('是否停用该应用') : t('是否启用该应用'), {
        onOk: async () => {
          try {
            if (record.status === StatusType.Disable) {
              await reqDocumentEnable({ id: record.id });
              message.success(t('启用成功'));
            }
            else {
              await reqDocumentDisable({ id: record.id });
              message.success(t('停用成功'));
            }
            updateTable();
          }
          catch (error: any) {
            error.message && message.error(error.message);
            throw error;
          }
        },
      });
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };

  const rowData = ref<Recordable>({});
  // 数据权限modal
  const permissionModalOpen = ref<boolean>(false);
  const savePermission = async () => {
    updateTable();
  };

  const columnsFirst: TableColumn[] = [
    {
      title: t('文档名称'),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: t('文档编号'),
      dataIndex: 'serial',
      width: 200,
    },
    {
      title: t('文档分类'),
      dataIndex: 'category_name',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('最后更新人'),
      dataIndex: 'update_user',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('最后更新时间'),
      dataIndex: 'update_time',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('启停'),
      dataIndex: 'status',
      width: 120,
      fixed: 'right',
      customRender: ({ record }) => {
        const loading = ref<boolean>(false);
        return (
          <Switch
            loading={loading.value}
            disabled={!hasPermission('230020001000009')}
            onClick={async () => {
              try {
                loading.value = true;
                await updateStatus(record);
              }
              finally {
                loading.value = false;
              }
            }}
            checkedValue={StatusType.Enable}
            unCheckedValue={StatusType.Disable}
            checked={record.status}
          >
          </Switch>
        );
      },
      hideInSearch: true,
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 240,
      actions: ({ record }) => [
        {
          label: t('编辑'),
          ifShow: () => record.status !== StatusType.Enable,
          code: '230020001000005',
          onClick: () => {
            pushToDetail('edit', record);
          },
        },
        {
          label: t('查看'),
          code: '230020001000006',
          onClick: () => {
            pushToDetail('view', record);
          },
        },
        {
          label: t('数据权限'),
          code: '230020001000007',
          onClick: () => {
            permissionModalOpen.value = true;
            rowData.value = record;
          },
        },
        {
          label: t('删除'),
          danger: true,
          ifShow: () => record.status !== StatusType.Enable,
          code: '230020001000008',
          onClick: () => {
            warnModal(t('是否删除该文档?'), {
              async onOk() {
                try {
                  await reqDocumentDelete({ id: record.id });
                  message.success(t('操作成功'));
                  pageRef.value?.fetchData();
                  return Promise.resolve();
                }
                catch (error: any) {
                  message.error(error.message);
                  return Promise.reject(error);
                }
              },
            });
          },
        },
      ],
    },
  ];

  const formFirstProps: Ref<Partial<FormProps>> = ref({
    showAdvancedButton: false,
    actionColOptions: {
      span: 12,
    },
  });

  const pushToDetail = (type: any, record: any) => {
    router.push({
      name: 'DocumentManageDocumentInfo',
      query: {
        type,
        ...record,
      },
    });
  };

  // 树
  const treeData = ref<DataNode[]>([]);
  const getTreeData = async () => {
    try {
      const { data } = await reqDocumentCategoryTree();
      treeData.value = [
        {
          id: 'all',
          name: t('全部'),
          categoryFlag: true,
          key: 'all',
          children: data,
        },
      ];
    }
    catch (_error) {}
  };

  const actionList: ActionListItem[] = [
    {
      title: t('新增子分类'),
      action: 'addChildren',
      ifShow: (node: ActionListItemCustomRenderParams) => {
        return node.nodeLevelInTree < 7 && hasPermission('230020001000001');
      },
    },
    {
      title: t('编辑分类'),
      action: 'editNode',
      ifShow: () => {
        return hasPermission('230020001000002');
      },
    },
    {
      title: t('删除分类'),
      action: 'deleteNode',
      ifShow: () => {
        return hasPermission('230020001000003');
      },
    },
  ];
  const treeModalOpen = ref<boolean>(false);
  const treeModalTitle = ref<string>(t('新增子分类'));
  const treeModalSubmit = async (values: Recordable) => {
    try {
      if (treeOperation.value === OperationType.Add) {
        await reqDocumentCategoryCreate({
          name: values.name,
          ...(values.parentId === 'all' ? {} : { parentId: values.parentId }),
        });
      }
      else {
        await reqDocumentCategoryUpdate({
          id: values.id,
          name: values.name,
        });
      }
      getTreeData();
      treeModalOpen.value = false;
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
  };
  const treeModalFormProps = reactive<FormProps>({
    initialValues: {
      parentId: 'all',
    },
    schemas: [
      {
        field: 'parentId',
        component: 'TreeSelect',
        label: t('上级分类'),
        required: true,
        componentProps: {
          disabled: true,
          request: async () => {
            return treeData.value;
          },
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
      },
      {
        field: 'name',
        component: 'Input',
        label: t('分类名称'),
        required: true,
      },
    ],
  });
  const treeSelectedKeys = ref<string[]>(['all']);
  const treeOperation = ref<OperationType>(OperationType.Add);
  // 删除树节点
  const deleteNodeFn = (node: any) => {
    Modal.confirm({
      title: t('是否删除该楼栋'),
      icon: createVNode(ExclamationCircleOutlined),
      closable: true,
      content: t('楼栋删除后无法恢复，是否删除'),
      okText: t('确认'),
      cancelText: t('取消'),
      onOk: async () => {
        try {
          await reqDocumentCategoryRemove({ id: node.id });
          message.success(t('删除成功'));
          getTreeData();
          if (node.selected) {
            treeSelectedKeys.value = ['all'];
          }
        }
        catch (error: any) {
          error.message && message.error(error.message);
        }
      },
    });
  };
  const handleTreeAction = (actionItem: ActionListItem, node: DataNode) => {
    switch (actionItem.action) {
      case 'ADD':
        treeModalTitle.value = t('新增分类');
        treeModalFormProps.initialValues = {
          parentId: 'all',
        };
        treeModalOpen.value = true;
        treeOperation.value = OperationType.Add;
        break;
      case 'addChildren':
        treeModalTitle.value = t('新增分类');
        treeModalFormProps.initialValues = {
          parentId: node.id,
        };
        treeModalOpen.value = true;
        treeOperation.value = OperationType.Add;
        break;
      case 'editNode':
        treeModalTitle.value = t('编辑分类');
        treeModalFormProps.initialValues = {
          id: node.id,
          parentId: node.data?.parentId ? node.data.parentId : 'all',
          name: node.name,
        };
        treeModalOpen.value = true;
        treeOperation.value = OperationType.Edit;
        break;
      case 'deleteNode':
        deleteNodeFn(node); // Commented out deleteNode function call
        break;
      default:
        break;
    }
  };

  onMounted(() => {
    getTreeData();
  });

  return {
    pageRef,
    updateTable,
    columnsFirst,
    formFirstProps,
    pushToDetail,
    firstRowData,
    bindProcessModalOpen,
    checkedProcessIds,
    permissionModalOpen,
    rowData,
    savePermission,
    treeData,
    treeSelectedKeys,
    actionList,
    handleTreeAction,
    treeModalOpen,
    treeModalTitle,
    treeModalFormProps,
    treeModalSubmit,
  };
};
