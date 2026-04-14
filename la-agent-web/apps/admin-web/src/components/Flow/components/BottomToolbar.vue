<template>
  <div class="bottom-toolbar">
    <template v-for="(item, key) in toolMap" :key="key">
      <Tooltip :title="item.label">
        <component :is="item.icon" @click="() => handleClickAction(item.action)" />
      </Tooltip>
    </template>
  </div>
  <EnvsModal
    v-model:open="envsModalOpen"
    v-model:envs="envs"
    :is-view="isView"
  />
</template>

<script lang="tsx" setup>
import type { JSX } from 'vue/jsx-runtime';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Tooltip } from 'ant-design-vue';
import EnvsModal from './EnvsModal.vue';

defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
});

const toolMap: {
  label: string;
  action: string;
  icon: () => JSX.Element;
}[] = [
  {
    label: t('环境变量'),
    action: 'envs',
    icon() {
      return <BMIcons icon="Set" />;
    },
  },
];

const envsModalOpen = ref<boolean>(false);
// 环境变量
const envs = defineModel('envs', {
  default: {},
});

const handleClickAction = (_action: string) => {
  envsModalOpen.value = true;
};
</script>

<style scoped lang="less">
.bottom-toolbar {
  height: 44px;
  box-shadow: 0px 0px 10px 0px #00000040;
  background: #ffffff;
  border-radius: 5px;
  padding: 8px 16px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
}
</style>
