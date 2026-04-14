import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { ConversationType } from '@/components/ChatModel/type';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { reqPlatformUserListByMenuId } from '@/api';

export const useTable = () => {
  const pageRef = ref<any>(null);
  const open = ref(false);

  const chatTitle = ref('');
  const chatQuery = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('对话时间'),
      dataIndex: 'last_chat_time',
      width: 200,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: t('应用名称'),
      dataIndex: 'agent_name',
      width: 200,
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
              const { data } = await reqPlatformUserListByMenuId('230040004');
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
      title: t('回答数'),
      dataIndex: 'reply_count',
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
      title: t('命中词组'),
      dataIndex: 'keyword_group',
      width: 200,
    },
    {
      title: t('命中关键词'),
      dataIndex: 'hit_word',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('对话时间'),
      dataIndex: 'chat_time',
      width: 200,
      fixed: 'left',
      hideInTable: true,
      formItemProps: {
        component: 'RangePicker',
      },
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 120,
      actions: ({ record }) => [
        {
          label: t('对话详情'),
          code: '230040004000001',
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
      ],
    },
  ];

  const formFirstProps: Partial<FormProps> = {
    showAdvancedButton: true,
    fieldMapToTime: [['chat_time', ['last_chat_start_time', 'last_chat_end_time'], 'YYYY-MM-DD']],
  };

  return {
    pageRef,
    columnsFirst,
    formFirstProps,
    open,
    chatQuery,
    chatTitle,
  };
};
