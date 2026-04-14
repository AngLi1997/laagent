<template>
  <Icon v-bind="attrs">
    <template #component>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.33333 5.33341V7.62939e-05H6.66667V5.33341H12V6.66674H6.66667V12.0001H5.33333V6.66674H0V5.33341H5.33333Z"
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

