import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { reqPlatformUserListByMenuId, reqTagTuningSendTags } from '@/api';
import { ConversationType } from '@/components/ChatModel/type';
import { useWarn } from '@/hooks';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { message } from 'ant-design-vue';

export const useTable = () => {
  const pageRef = ref<any>(null);
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };
  const { warnModal } = useWarn();

  const open = ref(false);

  const chatTitle = ref('');
  const chatQuery = ref<Recordable>({});

  const rowData = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('会话'),
      dataIndex: 'conversation_name',
      width: 200,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: t('用户信息'),
      dataIndex: 'user_name',
      width: 200,
      formItemProps: {
        field: 'user_id',
        component: 'Select',
        componentProps: {
          request: async () => {
            try {
              const { data } = await reqPlatformUserListByMenuId('230040002');
              return data.map((userItem: any) => {
                return {
                  label: `${userItem.userName}-${userItem.loginName}`,
                  value: userItem.userId,
                };
              });
            }
            finally {}
          },
        },
      },
    },
    {
      title: t('应用名称'),
      dataIndex: 'agent_name',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('用户标记'),
      dataIndex: 'user_tag',
      width: 200,
      hideInSearch: true,
      customRender: ({ record }) => {
        return (
          <div>
            <BMIcons icon="Likes" />
            { record.user_tag_like_count || 0 }
            {'\t'}
            <BMIcons icon="Disliked" />
            {record.user_tag_dislike_count || 0}
          </div>
        );
      },
    },
    {
      title: t('管理员标注'),
      dataIndex: 'admin_tag',
      width: 200,
      hideInSearch: true,
      customRender: ({ record }) => {
        return (
          <div>
            <BMIcons icon="Likes" />
            { record.admin_tag_like_count || 0 }
            {'\t'}
            <BMIcons icon="Disliked" />
            { record.admin_tag_dislike_count || 0 }
          </div>
        );
      },
    },
    {
      title: t('标记时间'),
      dataIndex: 'latest_tag_time',
      width: 200,
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
          label: t('标注'),
          code: '230040002000001',
          onClick: () => {
            chatQuery.value = {
              id: record.conversation_id,
              type: ConversationType.detail,
            };
            chatTitle.value = t('标注');
            open.value = true;
          },
        },
        {
          label: t('下发'),
          code: '230040002000002',
          onClick: () => {
            warnModal(t('是否下发该标注'), {
              onOk: async () => {
                try {
                  await reqTagTuningSendTags({ id: record.conversation_id });
                  message.success(t('下发成功'));
                  updateTable();
                }
                catch (error: any) {
                  error.message && message.error(error.message);
                }
              },
            });
          },
        },
        {
          label: t('对话详情'),
          code: '230040002000003',
          onClick: () => {
            chatQuery.value = {
              id: record.conversation_id,
              type: ConversationType.detail,
              canLike: false,
            };
            chatTitle.value = t('对话详情');
            open.value = true;
          },
        },
        // {
        //   label: t('删除'),
        //   code: '230040002000004',
        //   danger: true,
        //   onClick: () => {
        //     warnModal(t('是否删除该数据'), {
        //       onOk: async () => {
        //         try {
        //           await reqQuestionsRemove(record.conversation_id);
        //           message.success(t('删除成功'));
        //           updateTable();
        //         }
        //         catch (error: any) {
        //           error.message && message.error(error.message);
        //         }
        //       },
        //     });
        //   },
        // },
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
    updateTable,
    open,
    chatTitle,
    chatQuery,
  };
};
