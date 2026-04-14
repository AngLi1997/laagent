import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { reqChatReviewDelete, reqChatReviewOperate } from '@/api';
import { useWarn } from '@/hooks';
import { usePermissionStore } from '@/stores/permission';
import { t } from '@bmos/i18n';
import { message, Switch } from 'ant-design-vue';
import { HandleType, OperationType } from '../type';

export const useTable = () => {
  const { hasPermission } = usePermissionStore();

  const pageRef = ref<any>(null);
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };

  const recordModalRef = ref<any>(null);

  // 启用状态改变
  const updateStatus = async (record: any) => {
    try {
      warnModal(record.enable ? t('是否停用该应用') : t('是否启用该应用'), {
        onOk: async () => {
          try {
            await reqChatReviewOperate(record.id, !record.enable);
            message.success(record.enable ? t('停用成功') : t('启用成功'));
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

  const { warnModal } = useWarn();

  const rowData = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('词组名称'),
      dataIndex: 'word_group',
      width: 200,
    },
    {
      title: t('处理方式'),
      dataIndex: 'handle_method',
      width: 200,
      hideInSearch: true,
      formItemProps: {
        component: 'Select',
        componentProps: {
          options: [
            { label: t('直接应答'), value: HandleType.STRAIGHT_ANSWER },
            { label: t('模糊覆盖'), value: HandleType.FUZZY_COVER },
          ],
        },
      },
      customRender: ({ record }) => {
        switch (record.handle_method) {
          case HandleType.STRAIGHT_ANSWER:
            return t('直接应答');
          case HandleType.FUZZY_COVER:
            return t('模糊覆盖');
          default:
            return '-';
        }
      },
    },
    {
      title: t('关键词组'),
      dataIndex: 'keyword_group',
      width: 300,
      hideInSearch: true,
    },
    {
      title: t('预设回答'),
      dataIndex: 'canned_answer',
      width: 300,
      hideInSearch: true,
    },
    {
      title: t('命中次数'),
      dataIndex: 'hit_count',
      width: 100,
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
      dataIndex: 'enable',
      width: 120,
      fixed: 'right',
      customRender: ({ record }) => {
        const loading = ref<boolean>(false);
        return (
          <Switch
            disabled={!hasPermission('230040001000006')}
            loading={loading.value}
            onClick={async () => {
              try {
                loading.value = true;
                await updateStatus(record);
              }
              finally {
                loading.value = false;
              }
            }}
            checked={record.enable}
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
          ifShow: () => !record.enable,
          code: '230040001000002',
          onClick: () => {
            toCreateWord(OperationType.Edit, { id: record.id });
          },
        },
        {
          label: t('查看'),
          code: '230040001000003',
          onClick: () => {
            toCreateWord(OperationType.View, { id: record.id });
          },
        },
        {
          label: t('拦截记录'),
          code: '230040001000004',
          onClick: () => {
            recordModalRef.value.openModal(record.id);
          },
        },
        {
          label: t('删除'),
          ifShow: () => !record.enable,
          code: '230040001000005',
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该数据'), {
              onOk: async () => {
                try {
                  await reqChatReviewDelete(record.id);
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

  const router = useRouter();

  const toCreateWord = (pageType: OperationType, params: any = {}) => {
    router.push({
      name: 'ServiceMonitoringContentReviewCreateWordGroup',
      query: {
        pageType,
        ...params,
      },
    });
  };

  return {
    pageRef,
    columnsFirst,
    recordModalRef,
    formFirstProps,
    rowData,
    updateTable,
    toCreateWord,
  };
};
