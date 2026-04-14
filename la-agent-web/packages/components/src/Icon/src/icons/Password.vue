<template>
  <Icon v-bind="attrs">
    <template #component>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="10" width="20" height="10" rx="5" fill="#0D376A" />
        <path
          d="M10 0C12.9486 0 15.3869 2.17293 15.4962 4.93627L15.5 5.13V7.65C15.5 8.39558 14.8844 9 14.125 9C13.4103 9 12.8229 8.4646 12.7563 7.78001L12.75 7.65V5.13C12.75 3.80956 11.5392 2.7 10 2.7C8.5158 2.7 7.33691 3.73172 7.25459 4.98937L7.25 5.13V7.65C7.25 8.39558 6.63439 9 5.875 9C5.16028 9 4.57292 8.4646 4.50629 7.78001L4.5 7.65V5.13C4.5 2.27517 6.98282 0 10 0Z"
          fill="#0D376A" />
      </svg>
    </template>
  </Icon>
</template>
<script lang="ts" setup>
  import Icon from '@ant-design/icons-vue';
  import { useAttrs } from 'vue';

  const attrs = useAttrs();
</script>
