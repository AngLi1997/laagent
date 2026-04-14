<template>
  <div class="flow-knowledgeBase-node">
    <div class="top">
      <BMIcons :icon="leftIcon" />
      <div class="label">
        {{ labelName }}
      </div>
      <Divider v-if="showDivider" type="vertical" />
      <Space>
        <BMIcons v-if="showSetIcon" :icon="setIcon" class="action-icon" @click.stop="setting" />
        <BMIcons v-if="showTestIcon" :icon="testIcon" class="action-icon" @click.stop="clickTest" />
      </Space>
    </div>
    <div v-if="showName && showName.length" class="bottom">
      {{ showName }}
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { Cell } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import { reqAgentAgentsKBList } from '@/api';
import { BMIcons } from '@bmos/icons';
import { Divider, Space } from 'ant-design-vue';
import { inject, onMounted, ref } from 'vue';
import { FlowNodeEnum } from '../type';

defineProps({
  leftIcon: {
    type: String,
    default: 'FlowKnowledgeBase',
  },
  setIcon: {
    type: String,
    default: 'FlowSet',
  },
  testIcon: {
    type: String,
    default: 'FlowTest',
  },
  showTestIcon: {
    type: Boolean,
    default: true,
  },
  showSetIcon: {
    type: Boolean,
    default: true,
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['setting', 'clickTest', 'clickFile']);
const getNode = inject('getNode') as () => Cell;

const node = ref<any>({});
const labelName = ref<string>('');
const curFormData = ref<Recordable>({});

const setting = () => {
  emit('setting', node.value as Cell);
};

const clickTest = () => {
  emit('clickTest', node.value as Cell);
};

const kbList = ref<any[]>([]);
const getKbList = async () => {
  try {
    const { data } = await reqAgentAgentsKBList();
    if (data) {
      kbList.value = data;
    }
  }
  catch (_error) {

  }
};

const showName = computed(() => {
  return kbList.value.find(item => item.id === curFormData.value[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`]?.id)?.name || '';
});

onMounted(() => {
  getKbList();
  node.value = getNode();
  labelName.value = node.value.data?.label || '';
  curFormData.value = node.value.data?.formData || {};
  const size = node.value?.size();
  node.value.on('change:data', ({ current }: any) => {
    const { label, formData } = current;
    labelName.value = label;
    curFormData.value = formData;
    if (formData[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`] && formData[`${FlowNodeEnum.KNOWLEDGE_BASE}_config`]?.id) {
      node.value?.resize(size.width, 94);
    }
  });
});
</script>

<style scoped lang="less">
.flow-knowledgeBase-node {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: var(--bmos-primary-color-white);
  padding: 12px;
  border: 1px solid var(--bmos-primary-color-white);
  display: flex;
  flex-direction: column;
  gap: 12px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-around;
    line-height: 28px;
  }
  .bottom {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 6px 8px;
    height: 30px;
    border-radius: 4px;
    background: #f2f4f7;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 128.571% */
    color: var(--bmos-third-level-text-color);
  }
  .ant-divider-vertical {
    height: 1.5em;
  }
  .label {
    line-height: 1.3em;
    width: 100px;
    text-align: center;
    flex: 1;
  }
}

.action-icon {
  color: var(--bmos-primary-color);
  cursor: pointer;
}
</style>
