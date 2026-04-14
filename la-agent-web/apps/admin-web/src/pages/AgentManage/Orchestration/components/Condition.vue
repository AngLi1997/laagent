<template>
  <div v-for="item in list" :key="item.key" class="case-container">
    <div class="left">
      <Flex :gap="2" align="center">
        <span>{{ item.key }}</span>
        <Input
          v-model:value="item.variable_selector"
          style="flex: 1"
          :bordered="false"
          :placeholder="t('变量')"
          @change="() => triggerChange()"
        />
        <Divider type="vertical" style="font-size: 24px;" />
        <Select
          v-model:value="item.operator"
          style="width:40%"
          :placeholder="t('操作符')"
          :bordered="false"
          :options="operatorOption"
          @change="() => triggerChange()"
        />
      </Flex>
      <Divider style="margin: 0;" />
      <Select
        v-model:value="item.value_type"
        style="width: 100%"
        :bordered="false"
        :placeholder="t('值类型')"
        :options="valueTypeOptions"
        @change="() => triggerChange()"
      />
      <Divider style="margin: 0;" />
      <Input
        v-model:value="item.value"
        style="width: 100%"
        :bordered="false"
        :placeholder="t('值')"
        @change="() => triggerChange()"
      />
    </div>
    <div v-if="!isView" class="right">
      <BMIcons
        icon="Delete"
        style="width: 14px; height: 14px; color: var(--bmos-danger-color)"
        @click="() => deleteList(item)"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { Recordable } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Divider, Flex, Form, Input } from 'ant-design-vue';
import { ComparisonOperator, VariableTypeEnum } from '../type';

defineOptions({
  name: 'PromptsItem',
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    isView?: boolean;
  }>(),
  {
    isView: false,
  },
);

const emit = defineEmits<{
  (e: 'deleteList', key: string): void;
  (e: 'update', value: Array<Recordable>): void;
}>();

const operatorOption = computed(() => {
  return Object.values(ComparisonOperator).map(operator => ({
    label: t(`${operator}`),
    value: operator,
  }));
});

const valueTypeOptions = computed(() => {
  return Object.values(VariableTypeEnum).map((value) => {
    return {
      label: t(`${value}`),
      value,
    };
  });
});
const list = defineModel('list', {
  type: Array as PropType<Array<Recordable>>,
  default: () => [],
});

const formItemContext = Form.useInjectFormItemContext();
const triggerChange = () => {
  emit('update', list.value);
  formItemContext.onFieldChange();
};
const deleteList = (item: Recordable) => {
  const newList = list.value.filter((conditionItem: Recordable) => conditionItem.key !== item.key);
  list.value = newList;
  formItemContext.onFieldChange();
  emit('deleteList', item.key);
  emit('update', newList);
};
</script>

<style lang="less" scoped>
.case-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  .left {
    background-color: #fff;
    padding: 8px;
    border-radius: 6px;
  }
}
</style>
