<template>
  <Menu @click="({ key }) => menuClick(key, props.pane.key)">
    <MenuItem key="LEFT">{{ t('关闭左侧') }}</MenuItem>
    <MenuItem key="RIGHT">{{ t('关闭右侧') }}</MenuItem>
    <MenuItem key="ALL">{{ t('关闭其他') }}</MenuItem>
  </Menu>
</template>

<script setup lang="ts">
  import { Menu, MenuItem } from 'ant-design-vue';
  import { TabsPaneType, KEY } from './types';
  import { t } from '@bmos/i18n';
  import { ref } from 'vue';
  const props = defineProps({
    pane: {
      type: Object as () => TabsPaneType,
      required: true,
    },
    paneList: {
      type: Array as () => TabsPaneType[],
      required: true,
    },
  });
  const emit = defineEmits(['ClickAfter']);
  const curPaneList = ref<TabsPaneType[]>([]);
  const menuClick = (key: KEY, paneKey: KEY) => {
    curPaneList.value = props.paneList;
    const i = curPaneList.value.findIndex(item => item.key === paneKey);
    if (i < 0) return;
    const len = curPaneList.value.length;
    switch (key) {
      case 'LEFT':
        if (i !== 0) {
          curPaneList.value = curPaneList.value.slice(i);
          emit('ClickAfter', handleClickAfter(curPaneList.value, paneKey, 'LEFT'), curPaneList.value);
        }

        break;
      case 'RIGHT':
        if (i !== len) {
          curPaneList.value = curPaneList.value.slice(0, i + 1);
          emit('ClickAfter', handleClickAfter(curPaneList.value, paneKey, 'RIGHT'), curPaneList.value);
        }

        break;
      case 'ALL':
        curPaneList.value = curPaneList.value.filter(item => item.key === paneKey);
        emit('ClickAfter', handleClickAfter(curPaneList.value, paneKey, 'ALL'), curPaneList.value);
        break;
    }
  };
  const handleClickAfter = (paths: TabsPaneType[], key: KEY, _type: KEY) => {
    const maps = paths.reduce((prev, cur) => {
      prev.push([cur.key, cur]);
      return prev;
    }, [] as any);
    return { mapState: maps, key };
  };
</script>
