<template>
  <div style="padding: 12px; border-radius: 4px; width: 184px">
    <Input
      ref="inputRef"
      :placeholder="t('搜索关键字')"
      v-model:value="value"
      autofocus
      style="width: 160px; margin-bottom: 12px; display: block" />
    <Space>
      <Button style="width: 76px" @click="handleReset">{{ t('重置') }}</Button>
      <Button style="width: 76px" type="primary" @click="handleSearch">
        {{ t('搜索') }}
      </Button>
    </Space>
  </div>
</template>

<script setup lang="ts">
  import { t } from '@bmos/i18n';
  import { computed, ref } from 'vue';
  import { Input, Space, Button } from 'ant-design-vue';

  const inputRef = ref<typeof Input>();
  const emit = defineEmits<{
    (e: 'update:value', value: string | undefined): void;
    (e: 'search'): void;
    (e: 'reset'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      column: any;
      value: string | undefined;
    }>(),
    {
      column: {},
      value: '',
    },
  );

  const value = computed({
    get: (): string | undefined => {
      return props.value;
    },
    set: (val: string | undefined) => {
      emit('update:value', val);
    },
  });

  const handleSearch = () => {
    emit('search');
  };

  const handleReset = () => {
    value.value = void 0;
    emit('reset');
  };

  const focus = () => {
    inputRef.value?.focus();
  };

  defineExpose({
    focus,
  });
</script>
