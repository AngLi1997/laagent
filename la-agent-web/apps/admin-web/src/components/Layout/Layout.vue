<template>
  <Layout class="platform">
    <LayoutHeader :bmos-logo-blue="hasHidden" />
    <Layout>
      <LayoutSider v-show="!hasHidden" v-model:collapsed="collapsed" :style="{ background: '#103566' }">
        <Menu v-model:open-keys="openKeys" mode="inline" :selected-keys="selectedKeys" theme="dark" @click="menu_click">
          <BmSubMenu v-for="(item, index) in menuList" :key="index" :menu="item" />
        </Menu>
      </LayoutSider>
      <LayoutContent>
        <Header v-show="!hasHidden" />
        <div class="platform-content" :class="[hasHidden ? 'has-hidden' : '']">
          <router-view v-slot="{ Component }">
            <keep-alive v-if="isKeepAlive" :max="1">
              <component :is="Component" :key="currentKey" />
            </keep-alive>
            <component :is="Component" v-else :key="currentKey" />
          </router-view>
        </div>
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { KEY } from './type';
import { cloneDeep } from '@bmos/utils';
import { Layout, LayoutContent, LayoutSider, Menu } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from './components/header.vue';
import BmSubMenu from './components/menu.vue';
import { handleMenuList } from './store';

const props = withDefaults(
  defineProps<{
    list: Array<any>;
  }>(),
  {
    list: () => [],
  },
);
const router = useRouter();
const selectedKeys = ref<KEY[]>([]);
const openKeys = ref<KEY[]>([]);
const collapsed = ref<boolean>(false);

const menu_click: MenuProps['onClick'] = ({ key }) => {
  if (!selectedKeys.value.includes(key)) {
    selectedKeys.value = [key];
  }
  router.push(key as string);
};

const menuList = computed(() => {
  if (props.list.length === 0)
    return [];
  return handleMenuList(cloneDeep(props.list));
});

const parentKeys = (key: KEY, list: typeof menuList.value): KEY[] => {
  const parents: KEY[] = [];
  if (!(`${key}`).includes('/'))
    key = `/${key}`;
  for (let index = 0; index < list.length; index++) {
    const cur = list[index];

    if (cur.path === key) {
      parents.push(cur.path);

      return parents;
    }

    if (cur.children && cur.children.length > 0) {
      const res = parentKeys(key, cur.children);

      if (res && res.length > 0) {
        parents.push(cur.path, ...res);
        return parents;
      }
    }
  }
  return parents;
};

const handlePath = (route: RouteLocationNormalizedLoaded) => {
  if (menuList.value.length === 0)
    return;
  const { path, meta } = route;
  if (meta && meta.hidden)
    return;
  if (!path)
    return;
  let curPath: string = path;
  if (meta && meta.parentPath) {
    curPath = meta.parentPath as string;
  }
  selectedKeys.value = [curPath];

  const parentKey = parentKeys(curPath, menuList.value);
  parentKey.pop();
  const keys: any = new Set([...openKeys.value, ...parentKey]);
  openKeys.value = [...keys];
};
watch(
  () => [router.currentRoute.value, menuList.value],
  () => {
    handlePath(router.currentRoute.value);
  },
  {
    immediate: true,
  },
);
const route = useRoute();
const isKeepAlive = computed(() => route.meta.keepAlive);
const currentKey = computed(() => route.fullPath);
const hasHidden = computed(() => {
  return route.meta.hiddenMenu;
});
</script>

<style scoped lang="less">
  .ant-layout-header {
  width: 100%;
  height: 50px;
  padding-right: 2px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.ant-layout-header.tab-header-container {
  height: 38px;
}
.platform-content {
  height: inherit;
  height: calc(100% - 38px);
  padding: 12px;
  box-sizing: border-box;
}
.platform-content.has-hidden {
  padding: 0;
  height: 100%;
}
:deep(.platform-content.has-hidden .bread-crumb-container) {
  padding: 12px;
}
.ant-layout {
  height: 100%;
  background-color: var(--bmos-background-color);
}
:deep(.ant-layout-sider-children) {
  overflow-y: auto;
}
:deep(.ant-layout-sider-children)::-webkit-scrollbar {
  width: 0;
}
</style>
