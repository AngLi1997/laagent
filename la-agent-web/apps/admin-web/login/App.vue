<script setup lang="ts">
  import Login from './login/index.vue';
  import { BMConfigProvider } from '@bmos/components';
  import { init } from '@bmos/i18n';
  import { reactive, nextTick, watch, onMounted } from 'vue';
  import { setLanguage } from './utils';
  // import { vertify_chrome } from './utils';
  import { setLangResource } from './utils/handleLang';

  const LANG = reactive({
    language: 'zh_CN',
    refresh: false,
  });
  const changeLanguage = async (val: string) => {
    LANG.language = val;
    // 刷新登录页
    LANG.refresh = false;
    setLanguage(val);
    await setLangResource(val);
    await nextTick();
    LANG.refresh = true;
  };
  setLangResource(localStorage.getItem('LANG') || 'zh_CN').finally(() => {
    LANG.refresh = true;
  });
  onMounted(() => {
    // vertify_chrome();
  });

  watch(
    () => LANG.language,
    () => {
      init({
        lng: LANG.language,
      });
    },
    { immediate: true },
  );
</script>

<template>
  <BMConfigProvider prefixCls="ant">
    <Login v-if="LANG.refresh" :lang="LANG.language" @changeLang="changeLanguage"></Login>
  </BMConfigProvider>
</template>

<style scoped>
  header {
    max-height: 100vh;
    line-height: 1.5;
  }
</style>
