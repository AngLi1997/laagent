<template>
  <Card class="paragraph-card">
    <Score
      :show-score="props.showScore"
      :score="props.score"
      :chunk-index="props.chunkIndex"
      :content-len="props.contentLen"
    />
    <div class="paragraph-content">
      <TypographyParagraph>
        <!-- <div :class="`line ${expend ? '' : 'line-ellipsis'}`" v-html="matchedContent" />
        <Button type="link" @click="onExpend">
          {{ t('查看更多') }}
        </Button> -->
        <MatchedContent />
      </TypographyParagraph>
      <Tags v-if="props.showTag" :tags="props.keywords" />
    </div>
    <Divider v-if="props.showDoc" style="margin: 0; margin-top: 16px;" />
    <div v-if="props.showDoc" class="paragraph-footer">
      <img :src="doc" style="margin-right: 4px">
      <span class="text">{{ props.docFile }}</span>
      <Button type="link" style="margin-left: auto" @click="openDetail">
        {{ t('打开') }}
      </Button>
    </div>
  </Card>
  <ParagraphDetail ref="paragraphDetailRef" />
</template>

<script setup lang="tsx">
import type { PropType } from 'vue';
import { t } from '@bmos/i18n';
import { Button, Flex } from 'ant-design-vue';
import { doc } from '../../assets/index';
import ParagraphDetail from '../Detail/index.vue';
import Score from '../Score.vue';
import Tags from '../Tags.vue';

const props = defineProps({
  chunkIndex: {
    // 段落
    type: Number,
    default: 0,
  },
  score: {
    // 分数 0-1，两位小数
    type: Number,
    default: 0.5,
  },
  keyword: {
    // 关键词
    type: String,
    default: '',
  },
  contentLen: {
    // 内容长度
    type: Number,
    default: 0,
  },
  content: {
    // 内容
    type: String,
    default:
        '',
  },
  keywords: {
    // 标签
    type: Array as PropType<string[]>,
    default: () => [],
  },
  documentId: {
    // 文档id
    type: String,
    default: '',
  },
  docFile: {
    // 文档
    type: String,
    default: '文件.docx',
  },
  showScore: {
    // 是否显示分数
    type: Boolean,
    default: true,
  },
  showTag: {
    // 是否显示关键词
    type: Boolean,
    default: true,
  },
  showDoc: {
    // 是否显示文档名称
    type: Boolean,
    default: true,
  },
});

const paragraphDetailRef = ref<InstanceType<typeof ParagraphDetail>>();

const openDetail = () => {
  paragraphDetailRef.value?.openModal({ ...props, contentLen: props.contentLen });
};

const expend = ref(false);
const onExpend = () => {
  expend.value = !expend.value;
};
// 内容做关键词渲染匹配
const MatchedContent = defineComponent({
  setup() {
    return () => {
      if (!props.keyword) {
        return (
          <Flex align="flex-end" justify="space-between">
            <span class={`line ${expend.value ? '' : 'line-ellipsis'}`}>{props.content}</span>
            <Button type="link" size="small" onClick={onExpend}>
              {expend.value ? t('收起') : t('展开')}
            </Button>
          </Flex>
        );
      }
      const reg = new RegExp(`(${props.keyword})`, 'g');
      const parts = props.content.split(reg);
      return (
        <div class="line line-ellipsis">
          {
            parts.map((part, index) => {
              return index % 2 === 1
                ? (
                    <span key={index} style={{ color: 'red' }}>
                      {part}
                    </span>
                  )
                : (
                    part
                  );
            })
          }
        </div>
      );
    };
  },
});
</script>

<style lang="less" scoped>
  .text {
  color: #909398;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paragraph-card {
  // width: 100%;
  :deep(.@{prefixCls}-card-body) {
    padding: 16px;
    padding-bottom: 10px;
  }
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.paragraph-content {
  font-size: 14px;
  color: #242526;
  line-height: 18px;
  overflow: hidden;
}

.paragraph-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<style lang="less">
.line {
  white-space: pre-wrap;
  &-ellipsis {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}
</style>
