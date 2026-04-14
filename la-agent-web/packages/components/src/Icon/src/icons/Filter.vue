<template>
  <Icon v-bind="attrs">
    <template #component>
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_8089_56620)">
          <path
            d="M6.91667 12.5H9.58333V11.1667H6.91667V12.5ZM2.25 4.5V5.83333H14.25V4.5H2.25ZM4.25 9.16667H12.25V7.83333H4.25V9.16667Z" />
        </g>
        <defs>
          <clipPath id="clip0_8089_56620">
            <rect
              width="16"
              height="16"
              fill="white"
              transform="translate(0.25 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </template>
  </Icon>
</template>
<script lang="ts" setup>
  import Icon from '@ant-design/icons-vue';
  import { useAttrs } from 'vue';

  const attrs = useAttrs();
</script>
