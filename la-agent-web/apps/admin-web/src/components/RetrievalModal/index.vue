<template>
  <NormalModalForm
    ref="modalFormRef"
    :title="t('检索设置')"
    v-bind="{
      'open': trigger ? undefined : open,
      'onUpdate:open': updateOpen,
      ...(trigger ? triggerProps : {}),
    }"
    wrap-class-name="modalSizeMedium"
    :submit="submit"
  >
    <Collapse
      v-for="(item, index) in collapseList"
      :key="item.key"
      v-model:active-key="matching_type"
      class="match-collapse"
      accordion
      :style="{ marginTop: index ? '20px' : '0' }"
    >
      <CollapsePanel :key="item.key" :show-arrow="false">
        <template #header>
          <Space>
            <BMIcons :icon="item.icon" style="width: 30px; height: 30px;" />
            <Flex vertical>
              <span class="match-title">{{ item.title }}</span>
              <span class="match-tips">{{ item.text }}</span>
            </Flex>
          </Space>
        </template>
        <div>
          <FormItemRest>
            <Row :gutter="40">
              <Col :span="24" style="margin-bottom: 24px">
                <label class="match-label">{{ t('Rerank') }}</label>
                <Switch v-model:checked="rerank" />
              </Col>
              <Col :span="12" style="margin-right: auto">
                <label class="match-label">{{ t('Topk') }}</label>
                <br>
                <InputNumber v-model:value="top_k" :min="1" :max="1000" style="width: 100%" />
              </Col>
              <Col v-if="item.key === matchingTypeEnum.VECTOR" :span="12">
                <label class="match-label">{{ t('Score') }}</label>
                <br>
                <InputNumber v-model:value="score_threshold" :min="0" :max="1" :step="0.01" style="width: 100%" />
              </Col>
            </Row>
          </FormItemRest>
        </div>
      </CollapsePanel>
    </Collapse>
  </NormalModalForm>
</template>

<script setup lang="ts">
import type { ModalFormInstance, Recordable } from '@bmos/components';
import type { matchParamsType } from './type';
import { NormalModalForm } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Col, Flex, Row } from 'ant-design-vue';
import { matchingTypeEnum } from './type';

defineOptions({
  name: 'RetrievalModal',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    trigger?: boolean;
    triggerProps?: Recordable;
    params?: Recordable;
  }>(),
  {
    trigger: false,
    triggerProps: () => ({}),
    params: () => ({}),
  },
);

const emit = defineEmits(['saveParams']);

const open = ref(false);

const updateOpen = (val: boolean) => {
  if (props.trigger) {
    openModal(props.params as matchParamsType);
    return;
  }
  open.value = val;
};

const matching_type = ref<matchingTypeEnum>(matchingTypeEnum.VECTOR);
const rerank = ref(false);
const top_k = ref(10);
const score_threshold = ref(0.5);

const modalFormRef = ref<ModalFormInstance>();

const collapseList = reactive([
  {
    key: matchingTypeEnum.VECTOR,
    title: t('向量检索'),
    text: t('通过生成查询嵌入并查询与其向量表示最相似的文本分段'),
    icon: 'VectorRetrieval',
  },
  {
    key: matchingTypeEnum.FUZZY,
    title: t('全文搜索'),
    text: t('索引文档中的所有词汇，从而允许用户查询任意词汇，并返回包含这些词汇的文本片段'),
    icon: 'FuzzyRetrieval',
  },
]);

const openModal = (matchParams: matchParamsType) => {
  matching_type.value = matchParams.matching_type;
  rerank.value = matchParams.rerank;
  top_k.value = matchParams.top_k;
  score_threshold.value = matchParams.score_threshold;
  open.value = true;
};

const closeModal = () => {
  open.value = false;
};

const submit = () => {
  emit('saveParams', {
    matching_type: matching_type.value,
    rerank: rerank.value,
    top_k: top_k.value,
    score_threshold: score_threshold.value,
  });
  closeModal();
};

defineExpose({
  openModal,
  closeModal,
});
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
