<template>
  <div class="paragraph-header">
    <img :src="paragraph" style="margin-right: 8px" />
    <span style="color: #606266; font-size: 14px">
      {{ `${t('段落')}-${props.chunkIndex} · ${contentLen}${t('字符')}` }}
    </span>
    <div v-if="props.showScore && props.score" class="paragraph-header-score" style="margin-left: auto">
      <div
        :style="{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${props.score * 100}%`,
          height: '100%',
          backgroundColor: '#B2CCFF',
        }"></div>
      <span style="z-index: 2; position: relative">{{ `SCORE ${props.score}` }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { t } from '@bmos/i18n';
  import { paragraph } from '../assets/index';
  const props = defineProps({
    chunkIndex: { type: Number, default: 0 },
    contentLen: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    showScore: { type: Boolean, default: true },
  });
</script>

<style lang="less" scoped>
  .paragraph-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    &-score {
      position: relative;
      min-width: 80px;
      text-align: center;
      border: 1px solid #e1e3e5;
      border-radius: 4px;
      color: #2871ff;
      font-size: 12px;
    }
  }
</style>
