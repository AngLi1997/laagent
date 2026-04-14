<template>
  <div
    class="recall-testing-main"
    :style="{
      gap: layout === layoutEnum.horizontal ? '16px' : '0',
      padding: layout === layoutEnum.horizontal ? '16px' : '0',
      paddingRight: 0,
    }"
  >
    <Row :gutter="12" style="width: 100%; height: 100%">
      <Col :span="props.layout === layoutEnum.horizontal ? 12 : 24">
        <div class="recall-testing-left">
          <BMTableTitle v-if="props.layout === layoutEnum.horizontal" :title="t('召回测试')" />
          <p v-if="props.layout === layoutEnum.horizontal">
            {{ t('根据给定的查询文本测试知识的召回效果') }}
          </p>
          <div class="recall-testing-left-top">
            <div style="font-size: 14px; font-weight: bold">
              {{ t('源文本') }}
            </div>
            <Button size="small" style="margin-left: auto" @click="openRetrieval">
              {{ matchParams?.matching_type === matchingTypeEnum.VECTOR ? t('向量检索') : t('全文搜索') }}
            </Button>
            <Button v-if="props.layout === layoutEnum.vertical" size="small" type="primary" @click="testDoc">
              {{ t('测试') }}
            </Button>
          </div>
          <!-- <div
        class="recall-testing-left-content"
        :style="{ height: props.layout === layoutEnum.vertical ? '150px' : '250px', border: '1px solid #ccc' }">
        <Editor v-model="editorValue" :language="props.editorLng" />
      </div> -->
          <Input.TextArea
            v-model:value="editorValue"
            :placeholder="t('请输入文本')"
            style="border-radius: 0;"
            :auto-size="{ minRows: props.layout === layoutEnum.vertical ? 6 : 12 }"
          />
          <div v-if="props.layout === layoutEnum.horizontal" class="recall-testing-left-bottom">
            <Button :loading="testLoading" type="primary" @click="testDoc">
              {{ t('测试') }}
            </Button>
          </div>
        </div>
      </Col>
      <Col :span="props.layout === layoutEnum.horizontal ? 12 : 24">
        <div class="recall-testing-right" :style="{ marginTop: props.layout === layoutEnum.horizontal ? '0' : '16px' }">
          <Empty v-if="!testTag" style="margin: auto" :image="empty" :description="t('召回测试结果将展示在这里')" />
          <template v-else>
            <BMTableTitle :title="t('{}个召回段落').replace('{}', `${chunkList.length || 0}`)" />
            <div class="recall-testing-right-paragraph">
              <RecallParagraph
                v-for="item in chunkList"
                :key="item.chunk_id"
                :keyword="editorValue"
                :keywords="item.keywords"
                :content="item.content"
                :content-len="item.length"
                :document_id="item.document_id"
                :chunk_index="item.chunk_index"
                :doc-file="item.document_name"
                :show-score="matchParams?.matching_type === matchingTypeEnum.VECTOR"
                :score="item.score"
              />
            </div>
          </template>
        </div>
      </Col>
    </Row>
    <!-- <div class="recall-testing-left">
      <BMTableTitle v-if="props.layout === layoutEnum.horizontal" :title="t('召回测试')" />
      <p v-if="props.layout === layoutEnum.horizontal">
        {{ t('根据给定的查询文本测试知识的召回效果') }}
      </p>
      <div class="recall-testing-left-top">
        <div style="font-size: 14px; font-weight: bold">
          {{ t('源文本') }}
        </div>
        <Button size="small" style="margin-left: auto" @click="openRetrieval">
          {{ matchParams?.matching_type === matchingTypeEnum.VECTOR ? t('向量检索') : t('全文搜索') }}
        </Button>
        <Button v-if="props.layout === layoutEnum.vertical" size="small" type="primary" @click="testDoc">
          {{ t('测试') }}
        </Button>
      </div>
      <Input.TextArea
        :placeholder="t('请输入文本')"
        v-model:value="editorValue"
        style="border-radius: 0;"
        :autoSize="{ minRows: props.layout === layoutEnum.vertical ? 6 : 12 }"
      />
      <div v-if="props.layout === layoutEnum.horizontal" class="recall-testing-left-bottom">
        <Button :loading="testLoading" type="primary" @click="testDoc">
          {{ t('测试') }}
        </Button>
      </div>
    </div>
    <div class="recall-testing-right">
      <Empty v-if="!testTag" style="margin: auto" :image="empty" :description="t('召回测试结果将展示在这里')" />
      <template v-else>
        <BMTableTitle :title="t('{}个召回段落').replace('{}', `${chunkList.length || 0}`)" />
        <div class="recall-testing-right-paragraph">
          <RecallParagraph
            v-for="item in chunkList"
            :key="item.chunk_id"
            :keyword="editorValue"
            :keywords="item.keywords"
            :content="item.content"
            :content-len="item.length"
            :document_id="item.document_id"
            :chunk_index="item.chunk_index"
            :doc-file="item.document_name"
            :show-score="matchParams?.matching_type === matchingTypeEnum.VECTOR"
            :score="item.score"
          />
        </div>
      </template>
    </div> -->
  </div>
  <RetrievalModal ref="retrievalRef" @save-params="saveParams" />
</template>

<script setup lang="ts">
import type { matchParamsType } from '@/components/RetrievalModal/type';
import { reqDocumentRetrieval } from '@/api';
import Editor from '@/components/Editor/index.vue';
import RetrievalModal from '@/components/RetrievalModal/index.vue';
import { matchingTypeEnum } from '@/components/RetrievalModal/type';
import { BMTableTitle } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Col, Input, message, Row } from 'ant-design-vue';

import { empty } from './assets/index';
import { RecallParagraph } from './components';

const props = defineProps({
  layout: { type: String as PropType<'column' | 'row'>, default: 'row' },
  editorLng: { type: String as PropType<string>, default: 'plaintext' },
  id: { type: String as PropType<string>, default: '' },
  // 召回测试接口
  recallApi: { type: Function as PropType<(params: any) => Promise<any>>, default: reqDocumentRetrieval },
  // id字段转换
  idConvert: { type: String, default: 'document_id' },
});

enum layoutEnum {
  vertical = 'column',
  horizontal = 'row',
}

// 检索参数
const matchParams = ref<matchParamsType>({
  matching_type: matchingTypeEnum.VECTOR,
  rerank: false,
  top_k: 10,
  score_threshold: 0.5,
});

const saveParams = (params: matchParamsType) => {
  matchParams.value = params;
};

const retrievalRef = ref<InstanceType<typeof RetrievalModal>>();

const openRetrieval = () => {
  retrievalRef.value?.openModal(matchParams.value);
};

const editorValue = ref<string>('');

const testTag = ref<boolean>(false);
const testLoading = ref<boolean>(false);

const chunkList = ref<any[]>([]);

const testDoc = async () => {
  try {
    testLoading.value = true;
    const { data } = await props.recallApi({
      text: editorValue.value,
      [props.idConvert]: props.id,
      ...matchParams.value,
      score_threshold:
        matchParams.value.matching_type === matchingTypeEnum.VECTOR
          ? matchParams.value.score_threshold
          : undefined,
    });
    chunkList.value = data || [];
    testTag.value = true;
    message.success(t('测试成功'));
  }
  catch (error: any) {
    error.message && message.error(error.message);
  }
  finally {
    testLoading.value = false;
  }
};
</script>

<style lang="less" scoped>
.recall-testing-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  .recall-testing-left {
    overflow: hidden;
    &-top {
      height: 40px;
      border-radius: 4px 0;
      padding: 0 12px;
      background-color: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    &-bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 8px;
    }
  }
  .recall-testing-right {
    height: 100%;
    padding: 20px 16px;
    background-color: #f5f6f7;
    margin-bottom: 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &-paragraph {
      flex: 1; // 占满剩余空间
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
