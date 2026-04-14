<script lang="tsx" setup>
  import { computed, unref, useAttrs } from 'vue';
  import { DescriptionsItemProps, bmDescriptionsProps } from './types';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { isBoolean, isFunction } from '@bmos/utils';

  defineOptions({
    name: 'BMDescriptions',
  });
  const props = defineProps(bmDescriptionsProps);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));

  const getValue = (value: any) => {
    return <span>{value}</span>;
  };

  const getShow = (item: DescriptionsItemProps): { isShow: boolean; isIfShow: boolean } => {
    const { vShow, vIf, value, label } = unref(item);
    let isShow = true;
    let isIfShow = true;

    if (isBoolean(vShow)) {
      isShow = vShow;
    }
    if (isBoolean(vIf)) {
      isIfShow = vIf;
    }
    if (isFunction(vShow)) {
      isShow = vShow({
        value,
        label,
      });
    }
    if (isFunction(vIf)) {
      isIfShow = vIf({
        value,
        label,
      });
    }
    return { isShow, isIfShow };
  };

  mountStyle('-bmos-descriptions', style);
</script>
<template>
  <Descriptions
    v-bind="getBindValue"
    :class="[
      getBindValue.showBottomBorder ? 'show-bottom-border' : '',
      getBindValue.hasTitle ? 'has-title' : 'not-title',
    ]">
    <template v-for="item in list" :key="item.label">
      <DescriptionsItem
        v-if="getShow(item).isIfShow"
        v-show="getShow(item).isShow"
        :label="item.label"
        :span="item.span"
        :labelStyle="item.labelStyle"
        :content-style="item.contentStyle">
        <component :is="getValue(item.value)"></component>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>
