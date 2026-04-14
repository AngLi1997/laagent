<template>
  <NormalModalForm
    ref="modalFormRef"
    v-model:open="open"
    :title="t('嵌入网站')"
    wrap-class-name="modalSizeMedium"
    :show-ok-button="false"
  >
    <Flex align="center" justify="space-between">
      <div>
        {{ t('将以下iframe嵌入到目标网站中') }}
      </div>
      <Button type="link" @click="copy"><CopyOutlined /></Button>
    </Flex>
    <div style="height: 150px">
      <Editor v-model="editorVal" readOnly language="html" />
    </div>
    
  </NormalModalForm>
</template>

<script setup lang="ts">
import { Flex, message } from 'ant-design-vue';
import { CopyOutlined } from '@ant-design/icons-vue';
import type { ModalFormInstance } from '@bmos/components';
import { NormalModalForm } from '@bmos/components';
import Editor from '@/components/Editor/index.vue';
import { t } from '@bmos/i18n';

defineOptions({
  name: 'PublishAgent',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    id?: string;
  }>(),
  {
    id: '',
  },
);

const editorVal = computed(() => 
`<iframe
  src="http://${window.location.hostname}:8083/app/bmos-chat/pure-chat?agentId=${props.id}"
  style="width: 100%; height: 100%; min-height: 700px"
  frameborder="0"
  allow="microphone">
</iframe>`
);

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // 防止页面滚动
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const success = document.execCommand('copy');
    console.log(success ? '复制成功' : '复制失败');
  } catch (err) {
    console.error('复制异常', err);
    throw err;
  }
  document.body.removeChild(textarea);
};

const copy = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(editorVal.value);
  } else {
    fallbackCopy(editorVal.value);
  }
  message.success(t('复制成功'));
}

const open = defineModel('open', {
  type: Boolean,
  default: false,
});

const modalFormRef = ref<ModalFormInstance>();

</script>

<style lang="less" scoped>
.match-title {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
}

.match-tips {
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: #909398;
}

.match-label {
  margin-right: 12px;
}
</style>

<style lang="less">
.match-collapse {
  .ant-collapse-item {
    .ant-collapse-header[aria-expanded='true'] {
      border-radius: 8px 8px 0 0;
      background-color: #ebf1ff;
    }
    &:has(.ant-collapse-header[aria-expanded='true']) {
      border-bottom: none;
    }
  }
  .ant-collapse-content {
    border-top: none;
  }
  &:has(.ant-collapse-header[aria-expanded='true']) {
    border: 1.5px solid #2871ff;
  }
}
</style>
