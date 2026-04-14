import type { InitOptions } from 'i18next';
import type { I18nLanguageType } from './types';
import i18next from 'i18next';
import { I18nLanguageEnum } from './types';

export * from './types';

// 默认值
const DEFAULTlng = I18nLanguageEnum.ZH_CN;

// eslint-disable-next-line import/no-mutable-exports
export let currentLng: I18nLanguageType = DEFAULTlng; // 当前语言
// 创建一个I18n类，用于封装i18nNext的初始化和配置
class I18n {
  private static instance: I18n;
  private options: InitOptions = {};

  private constructor(options: InitOptions) {
    this.options = {
      lng: DEFAULTlng,
      defaultNS: 'translation',
      ...options,
    };
    this.init();
  }

  // 获取单例实例
  public static getInstance(options?: InitOptions): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n(options || {});
    }
    else if (options) {
      options.lng && I18n.instance.changeLanguage(options.lng as I18nLanguageType);
      if (options.resources) {
        Object.keys(options.resources).forEach((lng) => {
          I18n.instance.setResources(lng as I18nLanguageType, options.resources?.[lng]);
        });
      }
    }
    return I18n.instance;
  }

  // 初始化i18nNext
  private init() {
    i18next.init(this.options);
  }

  // 获取当前语言
  public getLanguage() {
    return currentLng || DEFAULTlng;
  }

  // 切换语言
  public changeLanguage(lng: I18nLanguageType) {
    currentLng = lng || DEFAULTlng;
    i18next.changeLanguage(currentLng);
  }

  // 设置资源
  public setResources(lng: I18nLanguageType, resources: any) {
    i18next.addResourceBundle(lng, 'translation', resources, true, true);
  }

  // 获取资源
  public getResources(lng: I18nLanguageType) {
    return i18next.getResourceBundle(lng, 'translation');
  }

  // 翻译文本
  public t(key: string, options?: any): string {
    if (!key)
      return '';
    if (!i18next.exists(key) && currentLng) {
      const obj = i18next.getResourceBundle(currentLng, 'translation');
      if (obj?.translation?.[key]) {
        return obj.translation[key];
      }
      // console.log(`%c i18n: ${key} not exists!`, 'color: red; border: 1px solid red; border-radius: 4px; padding: 2px;');
    }
    return (i18next.t(key, {
      ...options,
      lng: currentLng,
    }) || key) as string;
  }

  // 特殊翻译文本
  public customizeT(key: string, options?: any): string | boolean {
    if (!key)
      return false;
    if (i18next.exists(key)) {
      return i18next.t(key, {
        ...options,
        lng: currentLng,
      }) as string;
    }
    else if (currentLng) {
      const obj = i18next.getResourceBundle(currentLng, 'translation');
      if (obj?.translation?.[key]) {
        return obj.translation[key];
      }
    }
    console.error(`i18n: ${key} not exists!`);
    return false;
  }
}

/**
 * @description 初始化i18n
 * @param {InitOptions} options i18n初始化配置
 */
export const init = (options: InitOptions) => {
  I18n.getInstance(options);
};

/**
 * @description 切换语言
 * @param {I18nLanguageType} lng 语言
 */
export const changeLanguage = (lng: I18nLanguageType) => {
  I18n.getInstance().changeLanguage(lng);
};

/**
 * @description 翻译文本
 * @param {string} key 翻译的key
 * @return 翻译后的文本
 */
export const t = (key: string, options?: any): string => {
  return I18n.getInstance().t(key, options);
};

/**
 * @description 特殊翻译文本
 * @param {string} key 翻译的key
 * @param {any} options 翻译的key
 * @return {string | boolean} 翻译后的文本
 */
export const customizeT = (key: string, options?: any): string | boolean => {
  return I18n.getInstance().customizeT(key, options);
};

/**
 * @description 获取当前语言
 * @returns {string} 当前语言
 */
export const getLanguage = () => {
  return I18n.getInstance().getLanguage();
};

export default {
  init,
  changeLanguage,
  t,
  customizeT,
  getLanguage,
};

// 使用示例
// import { t, changeLanguage, init } from '@bmos/i18n';
//   init({
//     lng: 'zh-CN',
//   });
//   console.log(t('key'));
//   changeLanguage('en');
//   console.log(t('key'));
