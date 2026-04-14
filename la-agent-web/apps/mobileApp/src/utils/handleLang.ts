import { getI18nConfig } from '@/api/index.ts';
import { getItem } from '@/utils/mmkv';
import { I18nLanguageEnum, init } from '@bmos/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { LANGUAGE_KEY } from '@/types';

// 获取语言（适配 Android 和 iOS）
export const getLang = async (): Promise<string> => {
  try {
    // 从 AsyncStorage 中获取缓存的语言
    const cachedLanguage = getItem(LANGUAGE_KEY);
    if (cachedLanguage) {
      return cachedLanguage as string;
    }

    // 如果没有缓存，获取系统语言
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      return locales[0].languageTag; // 返回系统语言
    }

    return I18nLanguageEnum.ZH_CN; // 默认语言
  }
  catch (error) {
    console.error('Failed to get preferred language:', error);
    return I18nLanguageEnum.ZH_CN; // 默认语言
  }
};

// 处理语言初始化
export const handleLang = async () => {
  const lang = await getLang();
  const data = await AsyncStorage.getItem(lang);
  if (data) {
    init({
      lng: lang,
      resources: {
        [lang]: {
          translation: data,
        },
      },
    });
  }
  else {
    console.error('Failed to load resources');
    init({
      lng: lang,
    });
  }
};

// 更新语言资源
export const updateLangResource = async (lng: string) => {
  try {
    const { data } = await getI18nConfig();
    await AsyncStorage.setItem(lng, JSON.stringify(data));
    init({
      resources: {
        [lng]: data,
      },
    });
    return Promise.resolve();
  }
  catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// 设置语言资源
export const setLangResource = async (lng: string) => {
  try {
    let messages = await AsyncStorage.getItem(lng);
    if (!messages) {
      const { data } = await getI18nConfig();
      messages = data;
      // 缓存到 AsyncStorage
      await AsyncStorage.setItem(lng, JSON.stringify(data));
    }
    if (messages) {
      init({
        resources: {
          [lng]: {
            translation: JSON.parse(messages),
          },
        },
      });
      // 缓存语言到 AsyncStorage
      await AsyncStorage.setItem(LANGUAGE_KEY, lng);
      return Promise.resolve();
    }
  }
  catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
