import { t } from '@bmos/i18n';
import { cloneDeep, deepMerge, omit } from '@bmos/utils';
import { DataNode } from 'ant-design-vue/es/tree';
import { FieldNames } from 'ant-design-vue/es/vc-tree/interface';
import { ComputedRef, SetupContext, computed, ref, unref, watch } from 'vue';
import { FormProps } from '../../../Form/src/types';
import { ModalFormInstance } from '../../../ModalForm/src/types';
import { SearchTreeProps } from '../types';

export type SearchTreeState = ReturnType<typeof useSearchTreeState>;

export type useSearchTreeStateParams = {
  props: SearchTreeProps;
  attrs: SetupContext['attrs'];
};

export const useSearchTreeState = ({ props, attrs }: useSearchTreeStateParams) => {
  /** 内部属性 */
  const innerPropsRef = ref<Partial<SearchTreeProps>>({});
  /**
   * @description 获取props
   */
  const getProps = computed(() => {
    return {
      ...props,
      ...unref(innerPropsRef),
      ...(props.expandedKeys && {
        expandedKeys: [...new Set([...props.expandedKeys, ...(innerPropsRef.value.expandedKeys || [])])],
      }),
    };
  });

  // fieldNames 属性
  const fieldNamesRef: ComputedRef<Required<Omit<FieldNames & { parentId: string }, '_title'>>> = computed(() => {
    return deepMerge(
      {
        title: 'title',
        key: 'key',
        children: 'children',
        parentId: 'parentId',
      },
      { ...props.fieldNames },
    );
  });
  // tree 的值
  const treeData = ref<DataNode[]>([]);
  // 显示的树形数据
  const curTreeData = ref<DataNode[]>([]);

  // 监听 treeData
  watch(
    () => props.treeData,
    () => {
      treeData.value = props.treeData as DataNode[];
      curTreeData.value = cloneDeep(props.treeData);
    },
    { immediate: true, deep: true },
  );

  // tree 实例
  const searchTreeRef = ref<any>();

  // 获取tre所有属性
  const getSearchTreeProps = computed(() => {
    return {
      ...attrs,
      ...omit(getProps.value, ['expandedKeys']),
      ...(getProps.value.expandedKeys && {
        expandedKeys: getProps.value.expandedKeys,
      }),
      treeData: curTreeData.value,
    } as SearchTreeProps;
  });

  // form 属性
  const modalFormRef = ref<ModalFormInstance>();
  const formProps: FormProps = {
    schemas: [
      {
        field: 'name',
        component: 'Input',
        label: t('分类名称'),
        required: true,
        colProps: {
          span: 24,
        },
      },
    ],
    showActionButtonGroup: false,
  };

  // 如果props addChildrenNeedCode需要编码， schema 里面加上 code
  watch(
    () => props.addChildrenNeedCode,
    () => {
      if (props.addChildrenNeedCode) {
        formProps.schemas?.push({
          field: 'code',
          component: 'Input',
          label: t('分类编码'),
          required: true,
          colProps: {
            span: 24,
          },
        });
      }
    },
    { immediate: true, deep: true },
  );


  return {
    innerPropsRef,
    treeData,
    curTreeData,
    searchTreeRef,
    getSearchTreeProps,
    fieldNamesRef,

    // modalForm
    modalFormRef,
    formProps,
  };
};
