import type { FormProps, Recordable, TableColumn } from '@bmos/components';
import { reqQuestionsRemove } from '@/api';
import { useWarn } from '@/hooks';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { OperationType } from '../type';

export const useTable = () => {
  const pageRef = ref<any>(null);
  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };
  const { warnModal } = useWarn();

  const addModalOpen = ref<boolean>(false);
  const rowData = ref<Recordable>({});
  const columnsFirst: TableColumn[] = [
    {
      title: t('提问'),
      dataIndex: 'question',
      width: 200,
      fixed: 'left',
    },
    {
      title: t('回答'),
      dataIndex: 'answer',
      width: 400,
    },
    {
      title: t('创建时间'),
      dataIndex: 'mark_time',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('命中次数'),
      dataIndex: 'hit_number',
      width: 200,
      hideInSearch: true,
    },
    {
      title: t('操作'),
      align: 'left',
      key: 'ACTION',
      fixed: 'right',
      width: 200,
      actions: ({ record }) => [
        {
          label: t('编辑'),
          code: '230040003000002',
          onClick: () => {
            addModalOpen.value = true;
            operationType.value = OperationType.Edit;
            rowData.value = record;
          },
        },
        {
          label: t('删除'),
          code: '230040003000003',
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该问题'), {
              onOk: async () => {
                try {
                  await reqQuestionsRemove(record.id);
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
      span: 12,
    },
  };

  const operationType = ref<OperationType>(OperationType.Add);
  const handleAdd = () => {
    addModalOpen.value = true;
    operationType.value = OperationType.Add;
  };

  return {
    pageRef,
    columnsFirst,
    formFirstProps,
    rowData,
    addModalOpen,
    operationType,
    updateTable,
    handleAdd,
  };
};
