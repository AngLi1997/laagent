<template>
  <div class="bmos-tool-bar">
    <slot name="headerTitle" v-bind="tableInstance">
      <div class="bmos-tool-bar-title">
        {{ props.title }}
        <BMHelp v-if="props.titleTooltip" class="bmos-tool-bar-help" :text="props.titleTooltip" />
      </div>
    </slot>

    <div>
      <Space :size="16">
        <slot name="toolbar" v-bind="tableInstance"></slot>
        <template v-if="props.showRefresh">
          <Divider type="vertical" />
          <Refresh />
        </template>
      </Space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Space, Divider } from 'ant-design-vue';
  import { BMHelp } from '../../../Form';
  import { Refresh } from '.';
  import { PropType } from 'vue';
  import { TableActionType } from '../..';

  defineOptions({
    name: 'BMToolBar',
  });

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    titleTooltip: {
      type: String,
      default: '',
    },
    showRefresh: {
      type: Boolean,
      default: true,
    },
    /** 动态表格实例 */
    tableInstance: {
      type: Object as PropType<TableActionType>,
      default: null,
    },
  });
</script>
