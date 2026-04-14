import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { reqAgentToolRemove } from '@/api';
import { useWarn } from '@/hooks';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { OperationType } from '../type';

export const useTable = () => {
  const router = useRouter();
  const { warnModal } = useWarn();

  const pageRef = ref<any>(null);
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };
  // 数据权限modal
  const permissionModalOpen = ref<boolean>(false);
  const savePermission = async () => {
    updateTable();
  };

  const rowData = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('工具名称'),
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: t('工具类型'),
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: t('工具描述'),
      dataIndex: 'description',
      width: 300,
      hideInSearch: true,
    },
    {
      title: t('最后更新人'),
      dataIndex: 'update_user',
      width: 100,
      hideInSearch: true,
    },
    {
      title: t('最后更新时间'),
      dataIndex: 'update_time',
      width: 150,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 260,
      actions: ({ record }) => [
        {
          label: t('编辑'),
          code: '230010002000002',
          onClick: () => {
            router.push({
              name: 'BasicDataToolConfigDetail',
              query: {
                status: OperationType.Edit,
                id: record.id,
              },
            });
          },
        },
        {
          label: t('查看'),
          code: '230010002000003',
          onClick: () => {
            router.push({
              name: 'BasicDataToolConfigDetail',
              query: {
                status: OperationType.View,
                id: record.id,
              },
            });
          },
        },
        {
          label: t('数据权限'),
          code: '230010002000004',
          onClick: () => {
            permissionModalOpen.value = true;
            rowData.value = record;
          },
        },
        {
          label: t('删除'),
          code: '230010002000005',
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该工具'), {
              onOk: async () => {
                try {
                  await reqAgentToolRemove(record.id);
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

  const formFirstProps: Partial<FormProps> = {
    showAdvancedButton: false,
    actionColOptions: {
      span: 18,
    },
  };

  return {
    pageRef,
    columnsFirst,
    formFirstProps,
    rowData,
    permissionModalOpen,
    savePermission,
    updateTable,
  };
};
