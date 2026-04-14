<template>
  <div class="home-container" :style="style" />
</template>

<script setup lang="tsx">
import { getLogoUrl } from '@bmos/utils';
import { computed } from 'vue';

const style = computed(() => {
  return {
    backgroundImage: `url('${getLogoUrl('home-bg.png')}')`,
  };
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
