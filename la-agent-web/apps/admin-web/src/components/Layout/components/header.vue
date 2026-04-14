<template>
  <LayoutHeader style="background: #fff" class="tab-header-container">
    <div class="header-tabs-container">
      <Tabs
        ref="headerTabsREF"
        v-model:active-key="activeKey"
        hide-add
        type="editable-card"
        class="header-tabs"
        @edit="onEdit"
        @change="change"
      >
        <template #leftExtra>
          <span class="extra-icon extra-icon-left">
            <Button type="text" size="small" :disabled="extraIcon.Left" @click="scollWrap('left')">
              <template #icon>
                <DoubleLeftOutlined style="font-size: 10px" />
              </template>
            </Button>
          </span>
        </template>
        <template #rightExtra>
          <span class="extra-icon extra-icon-right">
            <Button type="text" size="small" :disabled="extraIcon.Right" @click="scollWrap('right')">
              <template #icon>
                <DoubleRightOutlined style="font-size: 10px" />
              </template>
            </Button>
          </span>
        </template>
        <template #moreIcon />
        <TabPane v-for="pane in paneList" :key="pane.key">
          <template #tab>
            <Dropdown :trigger="['contextmenu']" arrow placement="bottom">
              <span>
                {{ pane.tab }}
              </span>
              <template #overlay>
                <slot name="tabBarExtraContent">
                  <BMMenuClose :pane="pane" :pane-list="paneList" @click-after="handleClickAfter" />
                </slot>
              </template>
            </Dropdown>
          </template>
        </TabPane>
      </Tabs>
    </div>
  </LayoutHeader>
</template>

<script setup lang="ts">
import type { TabsProps } from 'ant-design-vue';
import type { VNode } from 'vue';
import type { KEY } from '../type';
import type { TabsPaneType } from './interface';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import { BMMenuClose } from '@bmos/components';
import { customizeT, t } from '@bmos/i18n';
import { Button, Dropdown, LayoutHeader, message, TabPane, Tabs } from 'ant-design-vue';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { DIRECTION } from './enum';

const router = useRouter();
const ACTION_REMOVE = 'remove';
const activeKey = ref<KEY>('/');
const headerTabsREF = ref<VNode>();
const tabsWrapREF = ref<HTMLElement>();

let paneMap = new Map();

const extraIcon = reactive({
  Left: false,
  Right: false,
});

const paneList = ref<TabsPaneType[]>([]);
const routerTo = (path: string) => {
  router.push(path);
};

const onEdit: TabsProps['onEdit'] = (event, action) => {
  if (action === ACTION_REMOVE) {
    // 必须保留一个
    if (paneMap.size === 1) {
      message.error(t('必须保留一个标签'));
      return;
    }

    let i = paneList.value.findIndex((item) => {
      return item.key === event;
    });
    paneMap.delete(event);
    paneList.value = [...paneMap.values()];

    if (event !== activeKey.value)
      return;

    i = Math.max(i - 1, 0);
    const next_key = paneList.value[i]?.key || '/';
    activeKey.value = next_key;
    routerTo(next_key as string);
  }
};

const handleClickAfter = (paths: any, pane: any) => {
  paneList.value = pane;
  const iscur = pane.findIndex((item: any) => item.key === activeKey.value);
  if (iscur < 0) {
    activeKey.value = paths?.key;
    routerTo(paths?.key as string);
  }
  paneMap = new Map(paths?.mapState);
};

const change: TabsProps['onChange'] = (activeKey) => {
  routerTo(activeKey as string);
};

const scollWrap = (dir: string) => {
  if (tabsWrapREF.value?.scrollLeft === 0) {
    return (extraIcon.Left = true);
  }

  const left = tabsWrapREF.value?.scrollLeft || 0;
  const width = tabsWrapREF.value?.offsetWidth || 0;

  if (left + width === tabsWrapREF.value?.scrollWidth) {
    return (extraIcon.Right = true);
  }

  if (dir === DIRECTION.L) {
    if (tabsWrapREF.value?.scrollLeft === 0) {
      return (extraIcon.Left = true);
    }
  }
};

const queryWarp = () => {
  if (!headerTabsREF.value)
    return;
  // @ts-ignore
  const tar = headerTabsREF.value?.$el?.querySelector('.ant-tabs-nav-wrap');
  if (!tar)
    return;
  if (tar.scrollWidth === 0) {
    extraIcon.Left = true;
    extraIcon.Right = true;
  }
  tabsWrapREF.value = tar as HTMLElement;
};

onMounted(() => {
  nextTick(() => queryWarp());
});

watch(
  () => router.currentRoute.value,
  () => {
    const { path, meta } = router.currentRoute.value;
    if (meta && meta.hidden)
      return;
    let curPath: string = path;
    if (meta && meta.parentPath) {
      curPath = meta.parentPath as string;
    }
    if (!paneMap.has(curPath)) {
      const pane = {
        key: curPath,
        tab: (customizeT(meta?.code as any) || meta?.title) as string,
      };
      paneList.value.push(pane);
      paneMap.set(curPath, pane);
    }
    activeKey.value = curPath;
  },
  {
    immediate: true,
  },
);
</script>

<style scoped lang="css">
.header-tabs-container {
  width: 100%;
}
.render-tab-bar {
  display: flex;
  justify-content: space-between;
}
.render-tab-bar.ant-tabs-nav {
  flex: 1;
}
.tab-header-container {
  height: auto;
  padding-inline: 8px;
  padding-top: 2px;
}
.extra-icon {
  display: flex;
  column-gap: 8px;
  color: rgba(108, 115, 128, 1);
  align-items: center;
}

.icon-content {
  padding: 7px;
  line-height: 1;
}

.extra-icon:hover {
  cursor: pointer;
}

.extra-icon-left {
  padding-right: 8px;
}

.extra-icon-left::after {
  content: '';
  display: block;
  width: 2px;
  height: 20px;
  border-radius: 2px;
  background: rgba(225, 227, 229, 1);
}

.extra-icon-right {
  padding-left: 8px;
}

.extra-icon-right::before {
  content: '';
  display: block;
  width: 2px;
  height: 20px;
  border-radius: 2px;
  background: rgba(225, 227, 229, 1);
}

:deep(.header-tabs .ant-tabs-nav) {
  margin-bottom: 0;
}

:deep(.header-tabs .ant-tabs-tab) {
  border: none;
}
:deep(.header-tabs .ant-tabs-nav-operations) {
  display: none;
}
</style>
