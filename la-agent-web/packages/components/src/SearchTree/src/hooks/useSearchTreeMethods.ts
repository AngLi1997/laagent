import { cloneDeep } from '@bmos/utils';
import { Modal } from 'ant-design-vue';
import { DataNode } from 'ant-design-vue/es/tree';
import { ref } from 'vue';
import {
  ActionListItem,
  NodeKey,
  OnExpandCallbackParams,
  SearchTreeEmitFn,
} from '../types';
import { SearchTreeState } from './useSearchTreeState';
import { t } from '@bmos/i18n';

export type SearchTreeMethods = ReturnType<typeof useSearchTreeMethods>;
type UseSearchTreeActionContext = SearchTreeState & {
  emit: SearchTreeEmitFn;
};

export const useSearchTreeMethods = (
  searchTreeAction: UseSearchTreeActionContext,
) => {
  const {
    emit,
    treeData,
    innerPropsRef,
    getSearchTreeProps,
    modalFormRef,
    fieldNamesRef,
  } = searchTreeAction;
  // 添加节点弹窗
  const addItemVisible = ref<boolean>(false);
  // 当前添加节点的 key
  const addItemKey = ref<string | number>('');
  /**
   * @description 添加节点 - 点击添加按钮
   */
  const handleClickAdd = (key: NodeKey) => {
    addItemKey.value = key;
    emit('addItem', key);
  };

  /**
   * @description 添加节点 - 确认
   */
  const handleAddItem = async () => {
    try {
      const formValues = await modalFormRef.value?.validate();
      const name = formValues?.name ?? '';
      const code = formValues?.code ?? '';
      // 找到当前节点，并在children中添加新节点
      const loop = (data: DataNode[]): DataNode[] => {
        return data.map(item => {
          if (item[fieldNamesRef.value.key] === addItemKey.value) {
            item[fieldNamesRef.value.children] =
              item[fieldNamesRef.value.children] || [];
            item[fieldNamesRef.value.children].push({
              title: name,
              key: Number(new Date()),
              // 判断是否需要编码
              ...(getSearchTreeProps.value?.addChildrenNeedCode && { code }),
            });
          } else if (item[fieldNamesRef.value.children]) {
            item[fieldNamesRef.value.children] = loop(
              item[fieldNamesRef.value.children],
            );
          }
          return item;
        });
      };
      const data = cloneDeep(treeData.value);
      const newData = loop(data as DataNode[]);
      treeData.value = newData;
      // addItemKey 添加到 expandedKeys 中
      const expandedKeys = getSearchTreeProps.value.expandedKeys || [];
      innerPropsRef.value.expandedKeys = expandedKeys?.includes(
        addItemKey.value,
      )
        ? expandedKeys
        : [...expandedKeys, addItemKey.value];
      addItemVisible.value = false;
      emit('addItem', addItemKey.value);
    } catch (error) {}
  };
  /**
   * @description 删除节点 - 确认
   * @param key 节点的 key
   * @param title 节点的 title
   */
  const handleConfirmDelete = (key: NodeKey, title: string) => {
    Modal.confirm({
      title: t('删除确认'),
      content: `${t('确认删除节点')} ${title} ？`,
      okText: t('确认'),
      cancelText: t('取消'),
      onOk() {
        handleClickDelete(key);
      },
    });
  };
  /**
   * @description 删除节点 - 点击删除按钮
   * @param key 节点的 key
   */
  const handleClickDelete = (key: NodeKey) => {
    // 找到当前节点，并删除此节点
    const loop = (data: DataNode[]): (DataNode | null)[] => {
      return data
        .map(item => {
          if (item[fieldNamesRef.value.key] === key) {
            return null;
          } else if (item[fieldNamesRef.value.children]) {
            item[fieldNamesRef.value.children] = loop(
              item[fieldNamesRef.value.children],
            ).filter(item => item !== null) as DataNode[];
          }
          return item;
        })
        .filter(item => item !== null);
    };
    const data = cloneDeep(treeData.value);
    const newData = loop(data as DataNode[]) as DataNode[];
    treeData.value = newData;
    // emit('deleteItem', key, treeData.value);
  };

  /**
   * @description 点击操作按钮
   * @param key 节点的 key
   * @param {ActionListItem} action 操作项
   * @returns {void}
   */
  const handleClickAction = (node: DataNode, action: ActionListItem) => {
    emit('action', action, node);
  };

  /**
   * @description 获取节点的层级
   * @param key 节点的 key
   * @returns {number} 节点的层级
   */
  const getNodeLevel = (key: NodeKey) => {
    let result: NodeKey[] = [];
    function loop(tree: DataNode[]) {
      for (let node of tree) {
        if (node[fieldNamesRef.value.key] === key) {
          result.push(node[fieldNamesRef.value.key]);
          return true;
        }
        if (
          node[fieldNamesRef.value.children] &&
          node[fieldNamesRef.value.children].length > 0
        ) {
          if (loop(node[fieldNamesRef.value.children])) {
            result.push(node[fieldNamesRef.value.key]);
            return true;
          }
        }
      }
      return false;
    }
    loop(treeData.value);
    return result.length;
  };

  /**
   * @description 判断节点的层级是否小于7
   * @param key 节点的 key
   * @returns {boolean} 是否小于7
   */
  const isLevelLessSeven = (key: NodeKey) => {
    return getNodeLevel(key) < 7;
  };

  /**
   * @description 根据 key 修改节点的 title
   * @param key 节点的 key
   * @param title 节点的 title
   */
  const changeNodeTitle = (key: NodeKey, title: string) => {
    // 找到当前节点，并修改 title
    const loop = (data: DataNode[]): DataNode[] => {
      return data.map(item => {
        if (item[fieldNamesRef.value.key] === key) {
          item.title = title;
        } else if (item[fieldNamesRef.value.children]) {
          item[fieldNamesRef.value.children] = loop(
            item[fieldNamesRef.value.children],
          );
        }
        return item;
      });
    };
    const newData = loop(treeData.value);
    treeData.value = newData;
  };

  // 展开节点
  const onExpand = (...rest: OnExpandCallbackParams) => {
    const [keys] = rest;
    innerPropsRef.value.autoExpandParent = false;
    innerPropsRef.value.expandedKeys = keys;
    emit('update:expanded-keys', keys);
    emit('expand', ...rest);
  };
  return {
    addItemVisible,
    handleClickAdd,
    handleAddItem,
    handleConfirmDelete,
    handleClickDelete,
    handleClickAction,
    getNodeLevel,
    isLevelLessSeven,
    changeNodeTitle,
    onExpand,
  };
};
