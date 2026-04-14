import { isObject } from '@bmos/utils';
import { DataNode } from 'ant-design-vue/es/tree';
import { TreeProps, treeProps } from 'ant-design-vue/es/tree/Tree';
import type { ComponentInternalInstance, ExtractPropTypes, PropType, VNode } from 'vue';
import { EmitFn, Key } from '../../../common/types/index';
import initDefaultProps from '../../../utils/initDefaultProps';
import type SearchTree from '../index.vue';

export const aSearchTreePropKeys = Object.keys(treeProps());

export type ActionListItemCustomRenderParams = DataNode & {
  nodeLevelInTree: number;
};

export interface ActionListItem {
  title: string;
  action: string;
  ifShow?: boolean | ((node: ActionListItemCustomRenderParams) => boolean);
  render?: (node: DataNode) => VNode;
}

// props 对象
export const searchTreeProps = {
  ...initDefaultProps(treeProps(), {
    treeData: [],
    selectable: true,
    autoExpandParent: true,
    expandedKeys: ['all'],
  }),
  // 搜索框的 placeholder
  searchPlaceholder: {
    type: String as PropType<string>,
  },
  // 是否显示搜索框
  showSearch: { type: Boolean as PropType<boolean>, default: true },
  // 是否添加全部项
  showAll: { type: Boolean as PropType<boolean>, default: true },
  // 是否显示添加子节点按钮
  showAddChildren: { type: Boolean as PropType<boolean>, default: true },
  // 是否显示删除节点按钮
  showDeleteNode: { type: Boolean as PropType<boolean>, default: true },
  // 是否显示全部的添加按钮
  showAllAddIcon: { type: Boolean as PropType<boolean>, default: true },
  // 是否显示更多操作
  showAction: { type: Boolean as PropType<boolean>, default: true },
  // 更多操作中显示的列表
  actionList: {
    type: Array as PropType<ActionListItem[]>,
    default: () => [],
  },

  // 开启搜索过滤
  filterSearch: { type: Boolean as PropType<boolean>, default: true },

  // 添加子节点是否需要编码
  addChildrenNeedCode: { type: Boolean as PropType<boolean>, default: false },
  // 树的类型 class
  treeTypeClass: { type: String as PropType<string>, default: 'displayTree' },
  // 顶层节点的 parentId
  rootParentId: { type: String as PropType<string>, default: '0' },
};

// props 类型
export type SearchTreeProps = Partial<ExtractPropTypes<typeof searchTreeProps>>;

/** 表格onExpand事件回调参数 */
export type OnExpandCallbackParams = Parameters<NonNullable<TreeProps['onExpand']>>;

export const searchTreeEmits = {
  register: (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  action: (action: ActionListItem, _node: DataNode) => isObject(action),
  addItem: (addItemKey: Key) => addItemKey,
  expand: (...rest: OnExpandCallbackParams) => rest,
  'update:expanded-keys': (keys: Key[]) => keys,
};

export type SearchTreeEmits = typeof searchTreeEmits;

export type SearchTreeEmitFn = EmitFn<SearchTreeEmits>;

// @ts-ignore:next-line
export type SearchTreeInstance = InstanceType<typeof SearchTree>;
