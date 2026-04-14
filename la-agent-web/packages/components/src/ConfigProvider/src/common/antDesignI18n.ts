import enUS from 'ant-design-vue/es/locale/en_US';
import ruRU from 'ant-design-vue/es/locale/ru_RU';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export type AntDesignLocaleType = 'zh_CN' | 'en_US' | 'ru_RU';
export type AntDesignLocale = {
  [key in AntDesignLocaleType]: any;
};

export default {
  zh_CN: zhCN,
  en_US: enUS,
  ru_RU: ruRU,
} as AntDesignLocale;
