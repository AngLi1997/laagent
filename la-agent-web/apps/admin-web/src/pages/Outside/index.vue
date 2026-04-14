<template>
  <div class="board-container">
    <iframe
      id="board"
      width="100%"
      height="100%"
      allowfullscreen
      class="board__iframe"
      style="display: block"
      :src="boardSrc"
    />
  </div>
</template>

<script setup lang="tsx">
import { getParameter } from '@/api';
import { sso } from '@bmos/messager';
import { onMounted, ref } from 'vue';

const { getUserToken } = sso;

// 获取当前路由的参数
const route = useRoute();

const boardSrc = ref('');

const getOutsideIp = async () => {
  try {
    const { data } = await getParameter('platform.sys.outside_url');
    const outsideJson: any = JSON.parse(data?.value || '{}');
    if (route.meta?.id && outsideJson?.[route.meta?.id as string]) {
      return Promise.resolve(outsideJson?.[route.meta?.id as string]);
    }
    else {
      return Promise.reject(new Error('Failed to retrieve outside IP'));
    }
  }
  catch (_error) {
    return Promise.reject(new Error('Unknown error occurred while retrieving outside IP'));
  }
};
  // 拼接url
const montage = async () => {
  const outsideIp = await getOutsideIp();
  const backUrl: string = route.meta?.outsideUrl as string; // ip
  const backToken = getUserToken(); // token
  if (backUrl?.includes('?')) {
    boardSrc.value = `${outsideIp + backUrl}&token=${backToken}`;
  }
  else {
    boardSrc.value = `${outsideIp + backUrl}?token=${backToken}`;
  }
};
onMounted(() => {
  montage();
});
</script>

<style scoped lang="less">
  .board-container {
  width: 100%;
  height: 100%;
}
</style>
