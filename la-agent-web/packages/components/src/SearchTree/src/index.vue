<!-- eslint-disable prettier/prettier -->
<template>
  <div class="bmos-search-tree">
    <InputSearch
      v-if="showSearch"
      v-model:value="searchValue"
      class="bmos-search-tree-input"
      allowClear
      :placeholder="getSearchTreeProps.searchPlaceholder ?? t('请输入关键字')"
      @search="handleSearch" />
    <slot name="search" v-bind="{ handleSearch }"></slot>
    <Tree
      v-if="getSearchTreeProps.treeData && getSearchTreeProps.treeData.length > 0"
      v-bind="objectPick(getSearchTreeProps, aSearchTreePropKeys)"
      ref="searchTreeRef"
      :class="[getSearchTreeProps.treeTypeClass, showSearch ? 'tree-inner-search-class ' : 'tree-inner-no-search']"
      @expand="onExpand">
      <template #switcherIcon="{ switcherCls }">
        <BMIcon :style="{ padding: 0 }" type="DownOutlined" :class="switcherCls"></BMIcon>
      </template>
      <template #title="data">
        <div class="bmos-tree-label">
          <div v-if="data.isUnMatched" class="is-unMatched">1</div>
          <BMEllipsis otherWidth="21" double>
            <template #title>
              <span>{{ data[fieldNamesRef.title] }}</span>
            </template>
            <!-- 判断是否传了 customizeTile 插槽 -->
            <template v-if="slots.customizeTitle">
              <slot
                name="customizeTitle"
                v-bind="{
                  ...data,
                  title: data[fieldNamesRef.title],
                  key: data[fieldNamesRef.key],
                  searchValue,
                }"></slot>
            </template>
            <template v-else>
              <span
                v-if="data[fieldNamesRef.title] && data[fieldNamesRef.title]?.indexOf(searchValue) > -1"
                class="bmos-tree-label-text">
                {{ data[fieldNamesRef.title].substr(0, data[fieldNamesRef.title].indexOf(searchValue)) }}<span 
                  class="bmos-tree-label-text bmos-tree-label-search">
                  {{ searchValue }}
                </span>{{
                  data[fieldNamesRef.title].substr(data[fieldNamesRef.title].indexOf(searchValue) + searchValue.length)
                }}
              </span><span v-else class="bmos-tree-label-text">
                {{ data[fieldNamesRef.title] }}
              </span>
            </template>
          </BMEllipsis>
          <BMIcon
            v-if="data[fieldNamesRef.key] === AllKEY.ALL && getSearchTreeProps.showAllAddIcon"
            type="Add"
            class="bmos-tree-label-icon-add"
            @click.stop="() => handleClickAdd(data[fieldNamesRef.key])"></BMIcon>
          <Dropdown
            v-else-if="getSearchTreeProps.showAction && data[fieldNamesRef.key] !== AllKEY.ALL"
            :trigger="['click']">
            <BMIcon v-show="!data.notShowMoreBtn" type="More" class="bmos-tree-label-icon-more" @click.stop></BMIcon>
            <template #overlay>
              <Menu>
                <template v-for="item in getSearchTreeProps.actionList">
                  <template v-if="getActionShow(item.ifShow, data)">
                    <menu-item v-if="item.render" :key="'actionRender' + item.title">
                      <component :is="item.render?.(data)"></component>
                    </menu-item>
                    <menu-item v-else :key="'action' + item.title">
                      <a href="#" @click="() => handleClickAction(data, item)">
                        {{ item.title }}
                      </a>
                    </menu-item>
                  </template>
                </template>
              </Menu>
            </template>
          </Dropdown>
          <slot
            name="action"
            v-bind="{
              ...data,
              title: data[fieldNamesRef.title],
              key: data[fieldNamesRef.key],
            }"></slot>
        </div>
      </template>
      <template v-for="item in Object.keys(slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </Tree>
    <Empty v-else></Empty>
    <BMModalForm
      ref="modalFormRef"
      v-model:open="addItemVisible"
      title="添加子节点"
      :formProps="formProps"
      @okModal="handleAddItem"></BMModalForm>
  </div>
</template>
<script lang="tsx" setup>
  import { Tree, InputSearch, Dropdown, Menu, MenuItem, Empty } from 'ant-design-vue';
  import { BMModalForm } from '../../ModalForm';
  import { searchTreeProps, AllKEY, aSearchTreePropKeys } from './types';
  import { searchTreeEmits } from './types/search-tree';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { useAttrs, useSlots } from 'vue';
  import {
    useSearchTreeState,
    useSearchTreeMethods,
    useSearch,
    createSearchTreeContext,
    type SearchTreeType,
  } from './hooks/';
  import { BMIcon } from '../../Icon';
  import { objectPick, isFunction, isBoolean } from '@bmos/utils';
  import { BMEllipsis } from '../../Ellipsis';
  import { t } from '@bmos/i18n';

  defineOptions({
    name: 'BMSearchTree',
    inheritAttrs: false,
  });
  const props = defineProps(searchTreeProps);
  const emit = defineEmits(searchTreeEmits);
  const attrs = useAttrs();
  const slots = useSlots();
  mountStyle('-bmos-search-tree', style);

  const searchTreeState = useSearchTreeState({
    props,
    attrs,
  });

  // 所有的状态
  const { searchTreeRef, getSearchTreeProps, modalFormRef, formProps, fieldNamesRef } = searchTreeState;

  const searchState = useSearch({ ...searchTreeState }, emit, props);
  const { searchValue, handleSearch } = searchState;
  // handleSearch(searchValue.value);

  const searchTreeMethods = useSearchTreeMethods({
    ...searchTreeState,
    emit,
  });
  // 所有的方法
  const { addItemVisible, handleClickAdd, handleAddItem, handleClickAction, onExpand, getNodeLevel } =
    searchTreeMethods;

  const getActionShow = (ifShow: any, data: any) => {
    let isShow = true;
    if (isFunction(ifShow)) {
      const nodeLevelInTree = getNodeLevel(data[fieldNamesRef.value.key]);
      isShow = ifShow({ ...data, nodeLevelInTree }) as boolean;
    } else if (isBoolean(ifShow)) {
      isShow = ifShow;
    }
    return isShow;
  };

  // 当前组件所有的状态和方法
  const instance = {
    ...searchTreeState,
    ...searchState,
    ...searchTreeMethods,
    getActionShow,
  } as SearchTreeType;

  createSearchTreeContext(instance);
  emit('register', instance);
  defineExpose(instance);
</script>
