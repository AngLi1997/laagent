<template>
  <SubMenu
    v-if="menu.children && menu.children.length > 0"
    :key="menu.path"
    :title="customizeT(menu.meta?.code as any) || menu.meta?.title">
    <template v-if="menu.meta?.icon" #icon>
      <img :src="menu.meta?.icon" style="width: 20px; height: 20px" />
    </template>
    <BmosSubmenu v-for="item in menu.children" :key="item.path" :menu="item"></BmosSubmenu>
  </SubMenu>
  <MenuItem v-else :key="menu.path + ''">
    {{ customizeT(menu.meta?.code as any) || menu.meta?.title }}
  </MenuItem>
</template>

<script setup lang="ts">
  import { SubMenu, MenuItem } from 'ant-design-vue';
  import { RouteRecordRaw } from 'vue-router';
  import { PropType, VueElement } from 'vue';
  import { customizeT } from '@bmos/i18n';

  defineProps({
    menu: {
      type: Object as PropType<RouteRecordRaw & { icon?: VueElement }>,
      required: true,
    },
  });
  defineOptions({
    name: 'BmosSubmenu',
  });
</script>

<style scoped lang="less"></style>
