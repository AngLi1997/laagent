import type { FormProps, TableColumn } from '@bmos/components';
import { reqDocumentChunkDelete } from '@/api';
import { useWarn } from '@/hooks';
import { t } from '@bmos/i18n';
import { message } from 'ant-design-vue';
import { modalTypeEnum } from '../../types';
import { typeEnum } from '../type';

export const useTable = (openEditParagraph: (type: modalTypeEnum, record?: any) => void) => {
  const pageRef = ref<any>(null);

  const router = useRouter();

  const type = ref<typeEnum>(router.currentRoute.value.query.type as typeEnum);

  const updateTable = () => {
    pageRef.value?.fetchData(0);
  };

  const { warnModal } = useWarn();

  const firstRowData = ref<any>({});
  const bindProcessModalOpen = ref<boolean>(false);

  const checkedProcessIds = ref<string[]>([]);

  const columnsFirst: TableColumn[] = [
    {
      title: t('分段序号'),
      dataIndex: 'chunk_index',
      width: 100,
      hideInSearch: true,
    },
    {
      title: t('字符数'),
      dataIndex: 'length',
      width: 100,
      hideInSearch: true,
    },
    {
      title: t('召回次数'),
      dataIndex: 'retrieval_count',
      width: 120,
      hideInSearch: true,
    },
    {
      title: t('分段内容'),
      dataIndex: 'content',
      width: 400,
      ellipsis: { showTitle: false },
    },
    {
      title: t('关键词'),
      dataIndex: 'keywords',
      width: 200,
      hideInSearch: true,
      customRender: ({ record }) => {
        return record.keywords?.join(',');
      },
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
          ifShow: type.value === typeEnum.edit,
          onClick: () => {
            openEditParagraph(modalTypeEnum.EDIT, record);
          },
        },
        {
          label: t('查看'),
          onClick: () => {
            openEditParagraph(modalTypeEnum.VIEW, record);
          },
        },
        {
          label: t('删除'),
          ifShow: type.value === typeEnum.edit,
          danger: true,
          onClick: () => {
            warnModal(t('是否删除该数据?'), {
              async onOk() {
                try {
                  await reqDocumentChunkDelete({ id: record.id });
                  message.success(t('操作成功'));
                  pageRef.value?.fetchData();
                  return Promise.resolve();
                }
                catch (error: any) {
                  message.error(error.message);
                  return Promise.reject();
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
      span: 18,
    },
  });

  const addFlow = (currentNode: any) => {
    router.push({
      name: 'audit-config-add-flow',
      query: {
        status: 'add',
        ...(currentNode.code && currentNode.isLeaf && { categoryCode: currentNode.code }),
      },
    });
  };

  return {
    pageRef,
    updateTable,
    columnsFirst,
    formFirstProps,
    addFlow,
    firstRowData,
    bindProcessModalOpen,
    checkedProcessIds,
  };
};
