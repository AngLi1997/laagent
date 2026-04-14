<template>
  <template v-for="(actionItem, index) in actionFilters" :key="`${index}-${actionItem.label}`">
    <component
      :is="actionItem.popConfirm ? Popconfirm : 'span'"
      :title="actionItem.title"
      v-bind="actionItem.popConfirm">
      <Button
        type="link"
        class="bmos-table-action-btn"
        :loading="loadingMap.get(getKey(actionItem, index))"
        :style="{
          maxWidth: '100px',
          minWidth: '40px',
        }"
        v-bind="actionItem">
        <BMEllipsis :other-width="15">
          {{ actionItem.label }}
          <template #title>{{ actionItem.label }}</template>
        </BMEllipsis>
      </Button>
    </component>
  </template>
  <template v-if="menuActionFilters.length">
    <Dropdown>
      <Button class="bmos-table-action-dropdown-btn" type="link" :icon="h(EllipsisOutlined)"></Button>
      <template #overlay>
        <Menu @click="handleMenuClick">
          <Menu-Item v-for="(actionItem, index) in menuActionFilters" :key="`${rowKey}${index}${actionItem.label}`">
            <Button
              type="link"
              class="bmos-table-dropdown-btn"
              :loading="loadingMap.get(getKey(actionItem, index))"
              :style="{
                maxWidth: '100px',
                minWidth: '40px',
              }"
              v-bind="omit(actionItem, ['onClick'])">
              <BMEllipsis>
                {{ actionItem.label }}
                <template #title>{{ actionItem.label }}</template>
              </BMEllipsis>
            </Button>
          </Menu-Item>
        </Menu>
      </template>
    </Dropdown>
  </template>
</template>

<script lang="tsx" setup>
  import { computed, ref, h, inject } from 'vue';
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { Popconfirm, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import type { PropType } from 'vue';
  import { EllipsisOutlined } from '@ant-design/icons-vue';
  import type { ActionItem } from '../types/tableAction';
  import type { CustomRenderParams } from '../types/column';
  import { isAsyncFunction, isBoolean, isFunction, omit } from '@bmos/utils';
  import type { Key } from '../../../common/types';
  import { BMEllipsis } from '../../../Ellipsis';
  import { bmosPropsKey, BmosPropsInjection } from '../../../ConfigProvider';

  defineOptions({
    name: 'BMTableAction',
  });

  const props = defineProps({
    actions: {
      // 表格行动作
      type: Array as PropType<ActionItem[]>,
      default: () => [],
    },
    columnParams: {
      type: Object as PropType<CustomRenderParams>,
      default: () => ({}),
    },
    rowKey: {
      type: [String, Number] as PropType<Key>,
      default: '',
    },
    maxActionCount: {
      type: Number,
      default: 4,
    },
  });

  const loadingMap = ref(new Map<string, boolean>());

  const actionFilters = computed(() => {
    if (props.actions?.length === 0) {
      return [];
    }

    const curActionFilters = props.actions.filter(item => {
      return isIfShow(item) && (!item.code || hasPermission?.(item.code));
    });

    const curActions = curActionFilters.map((item, index) => {
      const onClick = item.onClick;
      if (isAsyncFunction(onClick)) {
        item.onClick = async (e: any) => {
          e?.stopPropagation?.();
          const key = getKey(item, index);
          loadingMap.value.set(key, true);
          await onClick(props.columnParams).finally(() => {
            loadingMap.value.delete(key);
          });
        };
      } else if (isFunction(onClick)) {
        item.onClick = (e: any) => {
          e.stopPropagation();
          // @ts-ignore
          onClick(props.columnParams);
        };
      }
      return item;
    });
    if (curActionFilters?.length > props.maxActionCount) {
      return curActions.slice(0, props.maxActionCount - 1);
    }
    return curActions;
  });

  const bmosProps: BmosPropsInjection = inject(bmosPropsKey) as BmosPropsInjection;
  const hasPermission = bmosProps?.hasPermission;
  const menuActionFilters = computed(() => {
    const curActionFilters = props.actions.filter(item => {
      return isIfShow(item) && (!item.code || hasPermission?.(item.code));
    });
    if (curActionFilters?.length <= props.maxActionCount) {
      return [];
    }
    return curActionFilters
      .map((item, index) => {
        const onClick = item.onClick;
        if (isAsyncFunction(onClick)) {
          item.onClick = async (e: any) => {
            e.stopPropagation();
            const key = getKey(item, index);
            loadingMap.value.set(key, true);
            await onClick(props.columnParams).finally(() => {
              loadingMap.value.delete(key);
            });
          };
        }
        return item;
      })
      .slice(props.maxActionCount - 1);
  });

  const handleMenuClick = ({ key, domEvent }: any) => {
    const item = menuActionFilters.value.find((item, index) => {
      return getKey(item, index) === key;
    });
    if (item) {
      item?.onClick?.(domEvent);
    }
  };

  const isIfShow = (item: ActionItem) => {
    const ifShow = item.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(item);
    }
    return isIfShow;
  };

  const getKey = (actionItem: ActionItem, index: number) => {
    return `${props.rowKey}${index}${actionItem.label}`;
  };
</script>
