import type {
  ActionListItem,
  ActionListItemCustomRenderParams,
  DataRequestFn,
  FormProps,
  Recordable,
  TableColumn,
} from '@bmos/components';
import type { DataNode } from 'ant-design-vue/es/tree';
import { reqKnowledgeBaseCategoryCreate, reqKnowledgeBaseCategoryDelete, reqKnowledgeBaseCategoryTree, reqKnowledgeBaseCategoryUpdate, reqKnowledgeBaseDelete, reqKnowledgeBaseDisable, reqKnowledgeBaseEnable, reqKnowledgeBasePage } from '@/api';
import { useWarn } from '@/hooks';
import { usePermissionStore } from '@/stores/permission';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { t } from '@bmos/i18n';
import { message, Modal, Switch } from 'ant-design-vue';
import { createVNode } from 'vue';
import { OperationType } from '../type';

export const useTables = () => {
  const router = useRouter();
  const { warnModal } = useWarn();
  const { hasPermission } = usePermissionStore();

  const pageRef = ref<any>();
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };
  const rowData = ref<Recordable>({});
  // 数据权限modal
  const permissionModalOpen = ref<boolean>(false);
  const savePermission = async () => {
    updateTable();
  };
  // 启停
  const switchLoading = ref<boolean>(false);
  const changeStatus = async (record: any) => {
    switchLoading.value = true;
    try {
      warnModal(record.status === 'ENABLE' ? t('是否停用该知识库') : t('是否启用该知识库'), {
        onOk: async () => {
          try {
            if (record.status === 'ENABLE') {
              await reqKnowledgeBaseDisable(record.id);
              message.success(t('停用成功'));
            }
            else {
              await reqKnowledgeBaseEnable(record.id);
              message.success(t('启用成功'));
            }
            updateTable();
          }
          catch (error: any) {
            error.message && message.error(error.message);
          }
          finally {
            switchLoading.value = false;
          }
        },
      });
    }
    catch (error: any) {
      error.message && message.error(error.message);
    }
    finally {
      switchLoading.value = false;
    }
  };

  const templateColumn: TableColumn[] = [
    {
      title: t('知识库名称'),
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: t('知识库编号'),
      dataIndex: 'serial',
      width: 200,
    },
    {
      title: t('知识库分类'),
      dataIndex: 'category_name',
      hideInSearch: true,
      width: 200,
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
      sorter: true,
    },
    {
      title: t('启停'),
      dataIndex: 'status',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      customRender: ({ record }) => {
        return (
          <Switch
            disabled={!hasPermission('230020002000010')}
            checked={record.status === 'ENABLE'}
            loading={switchLoading.value}
            onClick={() => changeStatus(record)}
          />
        );
      },
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 280,
      actions: ({ record }) => [
        {
          label: t('编辑'),
          code: '230020002000005',
          ifShow: record.status !== 'ENABLE',
          onClick: () => {
            router.push({
              name: 'DocumentManageKnowledgeBaseDetail',
              query: {
                type: OperationType.Edit,
                id: record.id,
                category_id: record.category_id,
              },
            });
          },
        },
        {
          label: t('查看'),
          code: '230020002000006',
          onClick: () => {
            router.push({
              name: 'DocumentManageKnowledgeBaseDetail',
              query: {
                type: OperationType.View,
                id: record.id,
                category_id: record.category_id,
              },
            });
          },
        },
        {
          label: t('召回测试'),
          code: '230020002000007',
          onClick: () => {
            router.push({
              name: 'DocumentManageKnowledgeBaseRecallTest',
              query: {
                id: record.id,
              },
            });
          },
        },
        {
          label: t('数据权限'),
          code: '230020002000008',
          onClick: () => {
            permissionModalOpen.value = true;
            rowData.value = record;
          },
        },
        {
          label: t('删除'),
          code: '230020002000009',
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该知识库'), {
              onOk: async () => {
                try {
                  await reqKnowledgeBaseDelete(record.id);
                  message.success(t('删除成功'));
                  updateTable();
                }
                catch (error: any) {
                  error.message && message.error(error.message);
                }
              },
            });
          },
        },
      ],
    },
  ];

  // 树
  const treeData = ref<DataNode[]>([]);
  const getTreeData = async () => {
    try {
      const { data } = await reqKnowledgeBaseCategoryTree();
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
    catch (_error) { }
  };

  const actionList: ActionListItem[] = [
    {
      title: t('新增子分类'),
      action: 'addChildren',
      ifShow: (node: ActionListItemCustomRenderParams) => {
        return node.nodeLevelInTree < 7 && hasPermission('230020002000001');
      },
    },
    {
      title: t('编辑分类'),
      action: 'editNode',
      ifShow: () => {
        return hasPermission('230020002000002');
      },
    },
    {
      title: t('删除分类'),
      action: 'deleteNode',
      ifShow: () => {
        return hasPermission('230020002000003');
      },
    },
  ];
  const treeModalOpen = ref<boolean>(false);
  const treeModalTitle = ref<string>(t('新增子分类'));
  const treeModalSubmit = async (values: Recordable) => {
    try {
      if (treeOperation.value === OperationType.Add) {
        await reqKnowledgeBaseCategoryCreate({
          name: values.name,
          ...(values.parentId === 'all' ? {} : { parent_id: values.parentId }),
        });
      }
      else {
        await reqKnowledgeBaseCategoryUpdate({
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
  const deleteNodeFn = (node: DataNode) => {
    Modal.confirm({
      title: t('是否删除分类信息'),
      icon: createVNode(ExclamationCircleOutlined),
      closable: true,
      content: t('分类信息删除后无法恢复, 是否删除?'),
      okText: t('确定'),
      cancelText: t('取消'),
      onOk: async () => {
        try {
          await reqKnowledgeBaseCategoryDelete(node.id);
          message.success(t('删除成功'));
          getTreeData();
        }
        catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };
  const treeOperation = ref<OperationType>(OperationType.Add);
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
        deleteNodeFn(node);
        break;
      default:
        break;
    }
  };

  onMounted(() => {
    getTreeData();
  });

  const formFirstProps: Partial<FormProps> = {
    showAdvancedButton: false,
    actionColOptions: {
      span: 12,
    },
  };

  const getKnowledgeBasePage = async (params: any) => {
    if (!params.category_id || params.category_id === 'all') {
      return await reqKnowledgeBasePage({
        ...params,
        category_id: undefined,
      });
    }
    return await reqKnowledgeBasePage(params);
  };

  return {
    columns: [templateColumn],
    requests: [getKnowledgeBasePage] as unknown as DataRequestFn[],
    treeData,
    pageRef,
    formFirstProps,
    actionList,
    handleTreeAction,
    treeModalOpen,
    treeModalTitle,
    treeModalFormProps,
    treeModalSubmit,
    permissionModalOpen,
    savePermission,
    rowData,
  };
};
