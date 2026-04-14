<template>
  <div class="flow-left-toolbar">
    <div v-for="(item, key) in topMap" :key="key" class="group">
      <div
        v-for="action in item"
        :key="action.action"
        class="action" :class="[isView ? (action?.change ? 'disable-clicks' : '') : '']"
      >
        <Tooltip :title="action.label">
          <component :is="action.icon" @click="() => handleClickAction(action.action, action?.change)" />
        </Tooltip>
      </div>
      <Divider v-if="key < topMap.length - 1" type="vertical" style="height: 1.8em;" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { JSX } from 'vue/jsx-runtime';
import { BMIcon } from '@bmos/components';
import { t } from '@bmos/i18n';
import { Divider, Tooltip } from 'ant-design-vue';

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  showUndo: {
    type: Boolean,
    default: true,
  },
  showRedo: {
    type: Boolean,
    default: true,
  },
  showReset: {
    type: Boolean,
    default: true,
  },
  showZoomIn: {
    type: Boolean,
    default: true,
  },
  showZoomOut: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['undo', 'redo', 'reset', 'zoomIn', 'zoomOut', 'delete']);

const topBasicMap: {
  label: string;
  action: string;
  change?: boolean;
  icon: () => JSX.Element;
}[][] = [
  [
    {
      label: t('撤销'),
      action: 'undo',
      change: true,
      icon() {
        return <BMIcon type="Return" />;
      },
    },
    {
      label: t('恢复'),
      action: 'redo',
      change: true,
      icon() {
        return <BMIcon type="Redo" />;
      },
    },
  ],
  [
    {
      label: t('原大小展示'),
      action: 'reset',
      icon() {
        return <BMIcon type="Reset" />;
      },
    },
    {
      label: t('缩小'),
      action: 'zoomOut',
      icon() {
        return <BMIcon type="ZoomOut" />;
      },
    },
    {
      label: t('放大'),
      action: 'zoomIn',
      icon() {
        return <BMIcon type="ZoomIn" />;
      },
    },
  ],
  [
    {
      label: t('删除'),
      action: 'delete',
      change: true,
      icon() {
        return <BMIcon type="Delete" />;
      },
    },
  ],
];

const topMap = computed(() => {
  const map = topBasicMap.map((item) => {
    return item.filter((action) => {
      switch (action.action) {
        case 'undo':
          return props.showUndo;
        case 'redo':
          return props.showRedo;
        case 'reset':
          return props.showReset;
        case 'zoomIn':
          return props.showZoomIn;
        case 'zoomOut':
          return props.showZoomOut;
        case 'delete':
          return props.showDelete;
        default:
          return true;
      }
    });
  });
  return map.filter(item => item.length > 0);
});

const handleClickAction = (action: string, isChange: boolean | undefined) => {
  // 如果是查看模式, 不触发事件
  if (props.isView && isChange)
    return;
  switch (action) {
    case 'undo':
      emit('undo');
      break;
    case 'redo':
      emit('redo');
      break;
    case 'reset':
      emit('reset');
      break;
    case 'zoomIn':
      emit('zoomIn');
      break;
    case 'zoomOut':
      emit('zoomOut');
      break;
    case 'delete':
      emit('delete');
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="less">
  .flow-left-toolbar {
  // width: 300px;
  height: 44px;
  box-shadow: 0px 0px 10px 0px #00000040;
  background: #ffffff;
  border-radius: 5px;
  padding: 8px 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  .ant-divider-horizontal {
    margin-top: 5px;
    margin-bottom: var(--bmos-margin-medium);
  }
  .group {
    display: flex;
  }
  .action {
    margin: 0 6px;
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
  }
  .disable-clicks {
    cursor: not-allowed;
  }
  .ant-divider-vertical {
    height: 28px;
  }
}
</style>
