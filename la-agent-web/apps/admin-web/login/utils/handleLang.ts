import { init } from '@bmos/i18n';
import { getResources, storeResources } from '@bmos/utils';
import { getI18nConfig } from '../api';

export const setLangResource = async (lng: string) => {
  try {
    let messages = await getResources(lng);
    if (!messages) {
      const { data } = await getI18nConfig();
      messages = data;
      // 缓存到 IndexedDB
      await storeResources(lng, data);
    }
    if (messages) {
      init({
        resources: {
          [lng]: messages,
        },
      });
      return Promise.resolve();
    }
  } catch (error) {
    console.error(error);
    init({ lng });
    return Promise.resolve();
  }
};
