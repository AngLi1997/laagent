<template>
  <ConfigProvider v-bind="getBindValue">
    <template #renderEmpty>
      <div style="text-align: center">
        <BMIcon type="NoData" />
        <p>{{ t('暂无数据') }}</p>
      </div>
    </template>
    <slot></slot>
  </ConfigProvider>
</template>

<script lang="tsx" setup>
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import 'dayjs/locale/en';
  import 'dayjs/locale/ru';
  import { deepMerge, removeEmpty } from '@bmos/utils';
  import { ConfigProvider } from 'ant-design-vue';
  import { computed, provide, ref, unref, useAttrs } from 'vue';
  import { bmosPropsKey, configProviderInjectionKey } from './hooks/context';
  import { bmConfigProviderProps } from './types';
  import { mountStyle } from '../../utils/cssr';
  import commonStyle from './style/common';
  import basicStyle from './style/basic';
  import expandComponents from './style/expandComponents';
  import exception from './style/exception';
  import commonConfig from './common/config';
  import { t } from '@bmos/i18n';
  import antDesignI18n, { AntDesignLocaleType } from './common/antDesignI18n';
  import { BMIcon } from '../../Icon';

  defineOptions({
    name: 'BMConfigProvider',
  });

  const props = defineProps(bmConfigProviderProps);
  const dayjsLocaleMap: Record<string, string> = {
    zh_CN: 'zh-cn',
    en_US: 'en',
    ru_RU: 'ru',
  };

  dayjs.locale(dayjsLocaleMap[props.lang]);

  const attrs = useAttrs();
  // 传入的配置覆盖默认配置
  const getBindValue = computed(() => {
    return deepMerge(
      {
        locale: antDesignI18n[props.lang as AntDesignLocaleType],
        ...commonConfig,
      },
      removeEmpty({ ...unref(attrs), ...props }),
    );
  });

  let prefix = ref<string>((props.prefixCls as string) || 'ant');

  provide(configProviderInjectionKey, {
    clsPrefixRef: prefix,
  });

  provide(bmosPropsKey, {
    ...props.bmosProps,
  });

  ConfigProvider.config({
    prefixCls: prefix,
  });

  mountStyle('-bmos-config-provider', commonStyle, prefix.value);
  mountStyle('-bmos-config-provider-basic', basicStyle, prefix.value);
  mountStyle('-bmos-config-provider-common', expandComponents, prefix.value);
  mountStyle('-bmos-config-provider-exception', exception, prefix.value, 'title');
</script>
