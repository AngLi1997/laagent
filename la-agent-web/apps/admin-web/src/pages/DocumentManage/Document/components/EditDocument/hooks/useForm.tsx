import { RenderCallbackParams, type FormProps } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Flex } from 'ant-design-vue';
import { svgState, useSvg } from './useSvg';
import { reqDocumentCategoryTree } from '@/api';
import { typeEnum } from '../type';

/**
 * 选择显示内容
 * @enum {string} DocumentContent--文档内容
 * @enum {string} RecallTesting--召回测试
 */
export enum menuKey {
  /**
   * @description 文档内容
   */
  DocumentContent = 'DocumentContent',
  /**
   * @description 召回测试
   */
  RecallTesting = 'RecallTesting',
}

export const useForm = () => {
  const formRef = ref();
  const router = useRouter();

  const type = ref<typeEnum>(router.currentRoute.value.query.type as typeEnum);

  const selectMenu = ref<menuKey>(menuKey.DocumentContent);

  const { DocumentContent, RecallTesting } = useSvg();

  const formProps = reactive<FormProps>({
    initialValues: {
      menu: selectMenu.value,
    },
    showResetButton: false,
    showSubmitButton: false,
    baseColProps: { span: 24 },
    disabled: type.value === typeEnum.view,
    schemas: [
      {
        label: t('文档分类'),
        field: 'category_id',
        component: 'TreeSelect',
        required: true,
        componentProps: {
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id',
          },
          request: async () => {
            const { data } = await reqDocumentCategoryTree();
            return data;
          },
        },
      },
      {
        label: t('文档名称'),
        field: 'name',
        component: 'Input',
        required: true,
      },
      {
        label: t('文档编号'),
        field: 'serial',
        component: 'Input',
        required: true,
      },
      {
        noLabel: true,
        field: 'Divider',
        component: 'Divider',
      },
      {
        noLabel: true,
        field: 'menu',
        component: ({ formModel }: RenderCallbackParams) => (
          <Flex vertical>
            {[
              { key: menuKey.DocumentContent, icon: DocumentContent, text: t('文档内容') },
              { key: menuKey.RecallTesting, icon: RecallTesting, text: t('召回测试') },
            ].map(({ key, icon, text }) => (
              <div
                style={{
                  height: '38px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '8px',
                  padding: '0 16px',
                  borderRadius: '4px',
                  backgroundColor: formModel.menu === key ? '#EBF1FF' : '#fff',
                  color: formModel.menu === key ? '#2871FF' : '#606266',
                }}
                onClick={() => {
                  formModel.menu = key;
                  selectMenu.value = key;
                }}>
                {icon(formModel.menu === key ? svgState.SELECTED : svgState.UNSELECTED)}
                <span>{text}</span>
              </div>
            ))}
          </Flex>
        ),
      },
    ],
  });

  return { formRef, formProps, selectMenu };
};
