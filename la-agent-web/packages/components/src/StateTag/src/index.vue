<script lang="ts" setup>
  import { computed, onMounted, unref, useAttrs } from 'vue';
  import { bmStateTagProps, stateTagEmits } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { t } from '@bmos/i18n';

  defineOptions({
    name: 'BMStateTag',
  });
  const props = defineProps(bmStateTagProps);
  const emit = defineEmits(stateTagEmits);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
  mountStyle('-bmos-state-tag', style);

  onMounted(() => {
    emit('register');
  });
</script>
<template>
  <div
    v-bind="getBindValue"
    class="bm-state-tag"
    :class="[type ? `bm-state-tag_${type}` : 'bm-state-tag_default', isClick && 'bm-state-tag_pointer']"
    @click="(e: Event) => isClick && emit('click', e)">
    <slot>{{ t('确认') }}</slot>
  </div>
</template>
