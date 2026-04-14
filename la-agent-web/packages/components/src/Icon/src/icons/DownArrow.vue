<template>
  <Icon v-bind="attrs">
    <template #component>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="arrow-&#228;&#184;&#139;" clip-path="url(#clip0_13166_40475)">
          <g id="Group">
            <path
              id="Union"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.4447 3L10 8.09128L4.55531 3L3 4.45436L10 11L17 4.45436L15.4447 3ZM15.4447 9L10 14.0913L4.55531 9L3 10.4544L10 17L17 10.4544L15.4447 9Z"
              fill="#6C7380" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_13166_40475">
            <rect width="20" height="20" fill="white" />
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
