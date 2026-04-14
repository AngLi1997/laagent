<template>
  <DownOutlined :class="props.expand ? 'collapse-icon-up' : 'collapse-icon-down'" />
</template>

<script lang="ts" setup>
  import { DownOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    expand: { type: Boolean },
  });
</script>
