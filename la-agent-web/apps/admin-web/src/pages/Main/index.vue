<template>
  <Layout :list="list"></Layout>
</template>

<script setup lang="ts">
  import { RouteRecordRaw } from 'vue-router';
  import Layout from '@/components/Layout';
  import { getAsyncMenu } from '@/utils/asyncMenu';

  const list = ref<Array<RouteRecordRaw>>([]);
  onMounted(async () => {
    const res = await getAsyncMenu();
    list.value = res;
  });
</script>

<style scoped lang="less"></style>
