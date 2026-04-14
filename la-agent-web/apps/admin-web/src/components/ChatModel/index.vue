<template>
  <NormalModalForm
    v-model:open="open"
    :title
    wrap-class-name="chatModalSizeExtraLarge chatModel" :width="1290" :footer="null"
  >
    <div class="preview-content">
      <WujieVue width="100%" height="100%" name="chat" :url="chatUrl" :props="{ ...query, apiBase }" :sync="true" />
    </div>
  </NormalModalForm>
</template>

<script lang="tsx" setup>
import type { Recordable } from '@bmos/components';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { isEmpty } from '@bmos/utils';
import WujieVue from 'wujie-vue3';

defineOptions({
  name: 'ChatModel',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title?: string;
    url?: string;
    query?: Recordable;
  }>(),
  {
    title: () => t('测试'),
    url: '',
  },
);

const { bus } = WujieVue;

const apiBase = `${location.origin}/api/app`;

const open = defineModel<boolean>('open', {
  default: false,
});

const chatUrl = computed(() => {
  if (isEmpty(props.url)) {
    // 判断是否是开发环境还是生产环境

    // @ts-expect-error
    const isDev = import.meta.env.MODE === 'development';
    return isDev ? `http://${location.hostname}:8083/app/bmos-chat/pure-chat` : `${location.origin}/app/bmos-chat/pure-chat`;
  }
  else {
    return props.url;
  }
  //
});

// 主应用监听事件
bus.$on('chatMessage', (arg: any) => {
  console.log('chatMessage', arg);
});
// 主应用发送事件
// bus.$emit("事件名字", arg1, arg2, ...);
</script>

<style lang="less">
  .chatModel {
  .preview-content {
    // height: 100%;
    // min-height: 50vh;
    // display: flex;
    // flex-direction: column;
    // .wujie_iframe {
    //   flex: 1;
    // }
    height: 60vh;
  }
}
</style>
