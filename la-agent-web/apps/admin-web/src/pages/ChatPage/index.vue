<template>
  <div class="home-container">
    <WujieVue width="100%" height="100%" name="chat" :url :sync="true"></WujieVue>
  </div>
</template>

<script setup lang="tsx">
  const url = ref<string>('');

  onMounted(() => {
    // 判断是否是开发环境还是生产环境
    // @ts-ignore
    const isDev = import.meta.env.MODE === 'development';
    url.value = isDev ? 'http://192.168.115.17:8083/app/bmos-chat' : `${location.origin}/app/bmos-chat`;
  });
</script>
<style scoped lang="less">
  .home-container {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
