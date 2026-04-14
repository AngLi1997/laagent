<template>
  <Input
    ref="bmPasswordRef"
    v-bind="getBindValue"
    :placeholder="t('请输入密码')"
    :readonly="bmPasswordReadonly"
    :class="[pwdClass == true ? 'no-autofill-pwd' : 'no-auto2']"
    @focus="focusPasswordInput">
    <template #suffix>
      <span @click="showPwd">
        <EyeInvisibleOutlined v-if="passwordType === 'text'" />
        <EyeOutlined v-else />
      </span>
    </template>
    <template v-for="(_, key) in $slots" #[key]>
      <slot :name="key"></slot>
    </template>
  </Input>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, unref, useAttrs } from 'vue';
  import { Input } from 'ant-design-vue';
  import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';
  import { bmPasswordInputProps } from './types';
  import style from './style';
  import { mountStyle } from '../../utils/cssr';
  import { t } from '@bmos/i18n';

  defineOptions({
    name: 'BMPasswordInput',
    inheritAttrs: false,
  });
  const props = defineProps(bmPasswordInputProps);

  const attrs = useAttrs();
  const getBindValue = computed(() => ({ ...unref(attrs), ...props, autocomplete: 'off' }));

  const bmPasswordRef = ref<any>(null);

  const passwordType = ref<string>('text');
  const pwdClass = ref<boolean>(true);
  const bmPasswordReadonly = ref<boolean>(true);

  const focusPasswordInput = () => {
    bmPasswordReadonly.value = false;
  };

  const showPwd = () => {
    if (passwordType.value === 'text') {
      passwordType.value = '';
      pwdClass.value = false;
    } else {
      passwordType.value = 'text';
      pwdClass.value = true;
    }
    nextTick(() => {
      bmPasswordRef.value?.focus();
    });
  };

  mountStyle('-bmos-password-input', style);
</script>
