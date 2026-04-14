<template>
  <Tooltip placement="top">
    <template #title>
      <span>
        <!-- {{ $t('common.redo') }} -->
        刷新
      </span>
    </template>
    <BMIcon type="Refresh" @click="redo" />
  </Tooltip>
</template>
<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { useTableContext } from '../hooks/useTableContext';
  import { BMIcon } from '../../../Icon';

  defineOptions({
    name: 'BMRefresh',
  });

  const table = useTableContext();

  function redo() {
    table.reload();
  }
</script>
