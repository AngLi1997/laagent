import { cloneDeep, debounce } from '@bmos/utils';
import { DataNode } from 'ant-design-vue/es/tree';
import { ref, watch } from 'vue';
import { NodeKey, SearchTreeEmitFn, SearchTreeProps } from '../types';
import { generateList, getParentKey } from '../utils/treeKey';
import { SearchTreeState } from './useSearchTreeState';

export const useSearch = (searchTreeState: SearchTreeState, emit: SearchTreeEmitFn, props: SearchTreeProps) => {
  // 搜索的值
  const searchValue = ref<string>('');

  const {
    innerPropsRef,
    curTreeData, // 显示的树形数据
    fieldNamesRef, // 字段名
    treeData,
  } = searchTreeState;

  const expandKeys = ref<any[]>([]);

  const markDeptByKeyword = (data: DataNode[], keyword: string = '') => {
    return data.map(item => {
      let isUnMatched = true;

      if (item[fieldNamesRef.value.children]?.length) {
        // 递归对子项进行标记
        item[fieldNamesRef.value.children] = markDeptByKeyword(item[fieldNamesRef.value.children], keyword);
        // 如果子项中有匹配项，父项也应被标记为匹配
        if (item[fieldNamesRef.value.children].some((child: { isUnMatched: any }) => !child.isUnMatched)) {
          isUnMatched = false;
        }
      }

      // 检查当前项的标题是否包含关键字
      if (item[fieldNamesRef.value.title]?.includes(keyword)) {
        isUnMatched = false;
      }

      // 将匹配状态标记到当前项
      item.isUnMatched = isUnMatched;

      // 如果匹配则展开此项
      if (!isUnMatched) {
        expandKeys.value.push(item[fieldNamesRef.value.key] as string);
      }

      return item;
    });
  };

  const handleFilterSearch = (value: string) => {
    if (!props.treeData?.length) return;
    if (!value) {
      expandKeys.value = [props.treeData[0]?.[fieldNamesRef.value.key] as string];
      curTreeData.value = cloneDeep(props.treeData);
      innerPropsRef.value.expandedKeys = expandKeys.value;
      emit('update:expanded-keys', expandKeys.value);
      innerPropsRef.value.autoExpandParent = true;
      return;
    }
    expandKeys.value = [];
    curTreeData.value = markDeptByKeyword(cloneDeep(props.treeData), searchValue.value) as unknown as DataNode[];
    searchValue.value = value;
    setTimeout(() => {
      innerPropsRef.value.expandedKeys = expandKeys.value;
      innerPropsRef.value.autoExpandParent = true;
      emit('update:expanded-keys', expandKeys.value);
    }, 100);
  };

  const oriDataList = ref<DataNode[]>([]);
  watch(
    () => treeData.value,
    val => {
      oriDataList.value = generateList(val, fieldNamesRef.value);
    },
    { immediate: true, deep: true },
  );
  const handleShowSearch = (value: string) => {
    if (!value) return;
    const expanded: NodeKey[] = oriDataList.value
      ?.map((item: DataNode) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData.value, fieldNamesRef.value);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i) as NodeKey[];
    innerPropsRef.value.expandedKeys = expanded;
    emit('update:expanded-keys', expanded);
    searchValue.value = value;
    innerPropsRef.value.autoExpandParent = true;
  };

  const handleSearch = debounce((value: string) => {
    if (props.filterSearch) {
      handleFilterSearch(value);
    } else {
      handleShowSearch(value);
    }
  }, 300);

  watch(searchValue, value => {
    handleSearch(value);
  });

  return {
    searchValue,
    handleSearch,
  };
};
