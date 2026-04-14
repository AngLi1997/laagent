<template>
  <BMConfigProvider prefix-cls="ant" :lang="getLang()" :bmos-props="{ hasPermission }">
    <router-view />
    <TeleportContainer />
  </BMConfigProvider>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@/stores/permission';
import { getTeleport } from '@antv/x6-vue-shape';
import { BMConfigProvider } from '@bmos/components';
import { onMounted } from 'vue';
import { getAsyncMenu } from './utils/asyncMenu';
import { getLang } from './utils/handleLang';

const { hasPermission } = usePermissionStore();
const list = ref<Array<RouteRecordRaw>>([]);
onMounted(async () => {
  const res = await getAsyncMenu();
  list.value = res;
});
const TeleportContainer = getTeleport();
</script>

<style scoped>
  header {
  max-height: 100vh;
  line-height: 1.5;
}
</style>
