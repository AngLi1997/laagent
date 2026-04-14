import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { t } from '@bmos/i18n';
import { ConversationType } from '@/components/ChatModel/type';

export const useTable = () => {
  const pageRef = ref<any>(null);
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };

  const chatModelOpen = ref<boolean>(false);

  const chatQuery = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('模型名称'),
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: t('模型版本'),
      dataIndex: 'version',
      hideInSearch: true,
    },
    {
      title: t('模型url'),
      dataIndex: 'url',
      hideInSearch: true,
    },
    {
      title: t('模型类型'),
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: t('模型描述'),
      dataIndex: 'description',
      width: 300,
      hideInSearch: true,
    },
    {
      title: t('参数大小'),
      dataIndex: 'args',
      width: 100,
      hideInSearch: true,
    },
    {
      title: t('创造力'),
      dataIndex: 'temperature',
      width: 300,
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
      sorter: true,
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 200,
      actions: ({ record }) => [
        {
          label: t('测试'),
          code: '230010001000001',
          onClick: () => {
            chatQuery.value = {
              modelId: record.id,
              type: ConversationType.conversation,
              canLike: false,
            };
            chatModelOpen.value = true;
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
    chatModelOpen,
    chatQuery,
    updateTable,
  };
};
