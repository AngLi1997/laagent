<template>
  <div class="home-container">
    <iframe
      id="large-screen"
      width="100%"
      height="100%"
      :onload="load"
      allowfullscreen
      class="screen-app__iframe"
      style="display: block"
      :src="props.url"></iframe>
    <div class="screen-app__operation">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useMessage } from './hooks';
  import { MessageType, type eventType } from './types';

  defineOptions({
    name: 'BMScreenFrame',
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<{
      url: string;
    }>(),
    {
      url: '',
    },
  );

  const emit = defineEmits<{
    (e: 'receiveMessage', event: any): void;
  }>();

  const { iframeWindow, initIframeWindow, sendMessage } = useMessage();

  /**
   * iframe加载完后进行操作
   */
  const load = (_e: any) => {
    try {
      initIframeWindow('large-screen');
    } catch (error) {
      console.log(error, '---');
    }
  };

  const initListener = (messageEvent: MessageEvent) => {
    const { data: event }: { data: eventType } = messageEvent;
    if (event.type === MessageType.RECEIVE_MESSAGE) {
      emit('receiveMessage', event.data);
    }
  };

  defineExpose({ iframeWindow, sendMessage });

  onMounted(() => {
    // 监听message事件
    window.addEventListener('message', initListener);
  });

  onBeforeUnmount(() => {
    // 销毁时卸载监听
    window.removeEventListener('message', initListener);
  });
</script>
<style scoped lang="less">
  .home-container {
    width: 100%;
    height: 100%;
    background-size: cover;
    position: relative;
  }
  .screen-app__iframe {
    border: none;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: auto;
  }
  .screen-app__operation {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    & * {
      pointer-events: auto;
    }
  }
</style>
