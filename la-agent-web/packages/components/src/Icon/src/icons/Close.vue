<template>
  <Icon v-bind="attrs">
    <template #component>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.0004 8.82194L15.7921 3.03027L16.9704 4.20861L11.1787 10.0003L16.9704 15.7919L15.7921 16.9703L10.0004 11.1786L4.20873 16.9703L3.0304 15.7919L8.82206 10.0003L3.0304 4.20861L4.20873 3.03027L10.0004 8.82194Z"
          fill="#6C7380" />
      </svg>
    </template>
  </Icon>
</template>
<script lang="ts" setup>
  import Icon from '@ant-design/icons-vue';
  import { useAttrs } from 'vue';

  const attrs = useAttrs();
</script>
