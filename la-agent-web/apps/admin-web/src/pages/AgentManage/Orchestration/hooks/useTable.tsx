import type {
  ActionListItem,
  ActionListItemCustomRenderParams,
  DataRequestFn,
  FormProps,
  Recordable,
  TableColumn,
} from '@bmos/components';
import type { DataNode } from 'ant-design-vue/es/tree';
import { reqAgentCategoryCreate, reqAgentCategoryTree, reqAgentsCategoryRemove, reqAgentsCategoryUpdate, reqAgentsPage, reqAgentsRemove, reqAgentsStatus } from '@/api';
import { ConversationType } from '@/components/ChatModel/type';
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
  const changeStatus = async (record: any) => {
    try {
      warnModal(record.status === 'ENABLE' ? t('是否停用该应用') : t('是否启用该应用'), {
        onOk: async () => {
          try {
            if (record.status === 'ENABLE') {
              await reqAgentsStatus({
                id: record.id,
                status: 'disable',
              });
              message.success(t('停用成功'));
            }
            else {
              await reqAgentsStatus({
                id: record.id,
                status: 'enable',
              });
              message.success(t('启用成功'));
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

  // 调试
  const openChat = ref(false);
  const chatQuery = ref<Recordable>({});
  // 发布
  const openPublish = ref(false);
  const publishQuery = ref<Recordable>({});

  // 新增
  const addModalOpen = ref(false);
  const addModalStatus = ref<OperationType>(OperationType.Add);
  const addModalCategoryId = ref<string>('all');
  const toDetail = (id: string) => {
    router.push({
      name: 'AgentManageOrchestrationDetail',
      query: {
        status: OperationType.Edit,
        id,
      },
    });
  };

  const templateColumn: TableColumn[] = [
    {
      title: t('应用名称'),
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: t('应用描述'),
      dataIndex: 'description',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('分类'),
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
        // 启停
        const switchLoading = ref<boolean>(false);
        return (
          <Switch
            disabled={!hasPermission('230030001000011')}
            checked={record.status === 'ENABLE'}
            loading={switchLoading.value}
            onClick={async () => {
              try {
                switchLoading.value = true;
                await changeStatus(record);
              }
              finally {
                switchLoading.value = false;
              }
            }}
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
          label: t('编排'),
          code: '230030001000005',
          ifShow: record.status !== 'ENABLE',
          onClick: () => {
            toDetail(record.id);
          },
        },
        {
          label: t('编辑'),
          code: '230030001000005',
          ifShow: record.status !== 'ENABLE',
          onClick: () => {
            addModalOpen.value = true;
            addModalStatus.value = OperationType.Edit;
            rowData.value = record;
          },
        },
        {
          label: t('查看'),
          code: '230030001000006',
          onClick: () => {
            router.push({
              name: 'AgentManageOrchestrationDetail',
              query: {
                status: OperationType.View,
                id: record.id,
              },
            });
          },
        },
        {
          label: t('数据权限'),
          code: '230030001000007',
          onClick: () => {
            permissionModalOpen.value = true;
            rowData.value = record;
          },
        },
        {
          label: t('调试'),
          code: '230030001000008',
          onClick: () => {
            chatQuery.value = {
              agentId: record.id,
              type: ConversationType.conversation,
              canLike: false,
            };
            openChat.value = true;
          },
        },
        {
          label: t('发布'),
          code: '230030001000009',
          ifShow: record.status === 'ENABLE',
          onClick: () => {
            console.log('发布', record);
            openPublish.value = true;
            publishQuery.value = { id: record.id };
          },
        },
        {
          label: t('删除'),
          code: '230030001000010',
          ifShow: record.status !== 'ENABLE',
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该应用'), {
              onOk: async () => {
                try {
                  await reqAgentsRemove(record.id);
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
      const { data } = await reqAgentCategoryTree();
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

  onMounted(() => {
    getTreeData();
  });

  const getPageList = async (params: any) => {
    if (!params.category_id || params.category_id === 'all') {
      return await reqAgentsPage({
        ...params,
        category_id: undefined,
      });
    }
    return await reqAgentsPage(params);
  };

  const formFirstProps: Partial<FormProps> = {
    showAdvancedButton: false,
    actionColOptions: {
      span: 18,
    },
  };

  const actionList: ActionListItem[] = [
    {
      title: t('新增子分类'),
      action: 'addChildren',
      ifShow: (node: ActionListItemCustomRenderParams) => {
        return node.nodeLevelInTree < 7 && hasPermission('230030001000001');
      },
    },
    {
      title: t('编辑分类'),
      action: 'editNode',
      ifShow: () => {
        return hasPermission('230030001000002');
      },
    },
    {
      title: t('删除分类'),
      action: 'deleteNode',
      ifShow: () => {
        return hasPermission('230030001000003');
      },
    },
  ];
  const treeModalOpen = ref<boolean>(false);
  const treeModalTitle = ref<string>(t('新增子分类'));
  const treeModalSubmit = async (values: Recordable) => {
    try {
      if (treeOperation.value === OperationType.Add) {
        await reqAgentCategoryCreate({
          name: values.name,
          ...(values.parentId === 'all' ? {} : { parent_id: values.parentId }),
        });
      }
      else {
        await reqAgentsCategoryUpdate({
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
          await reqAgentsCategoryRemove(node.id);
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

  return {
    columns: [templateColumn],
    requests: [getPageList] as unknown as DataRequestFn[],
    treeData,
    pageRef,
    formFirstProps,
    permissionModalOpen,
    savePermission,
    rowData,
    actionList,
    handleTreeAction,
    treeModalOpen,
    treeModalTitle,
    treeModalFormProps,
    treeModalSubmit,
    openChat,
    chatQuery,
    openPublish,
    publishQuery,
    updateTable,
    addModalOpen,
    addModalStatus,
    addModalCategoryId,
    toDetail,
  };
};
