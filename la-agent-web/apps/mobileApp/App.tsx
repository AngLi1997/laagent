import type { ProviderProps } from '@ant-design/react-native';
import Main from '@/pages/Main';
import { Provider, Text, Toast } from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import ruRU from '@ant-design/react-native/lib/locale-provider/ru_RU';
import zhCN from '@ant-design/react-native/lib/locale-provider/zh_CN';
import { I18nLanguageEnum } from '@bmos/i18n';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getItem, getAvatar, getLang, updateLangResource } from '@/utils';
import { ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { PaperProvider } from 'react-native-paper';

type AntDesignLocaleType = 'zh_CN' | 'en_US' | 'ru_RU';
type AntDesignLocale = {
  [key in AntDesignLocaleType]: any;
};

type Locale = ProviderProps['locale'];

const dayjsLocaleMap: Record<string, string> = {
  zh_CN: 'zh-cn',
  en_US: 'en',
  ru_RU: 'ru',
};

const antDesignI18n = {
  zh_CN: zhCN,
  en_US: enUS,
  ru_RU: ruRU,
} as AntDesignLocale;

dayjs.locale('zh-cn');

const App: React.FC = () => {
  const [lang, setLang] = useState<AntDesignLocaleType>('zh_CN');
  const [loading, setLoading] = useState(true); // 全局 Loading 状态

  useEffect(() => {
    updateLangResource(I18nLanguageEnum.ZH_CN).then(async () => {
      try {
        const currentLang = await getLang() as AntDesignLocaleType;
        setLang(currentLang);
        if (getItem('BMOS-ACCESS-TOKEN')) {
          await getAvatar();
        }
        setLoading(false);
      }
      catch (error) {
        Alert.alert('error', JSON.stringify(error))
      }
    });
  }, []);

  Toast.config({ position: 'top' });

  dayjs.locale(dayjsLocaleMap[lang]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {/* @ts-ignore */}
      <Provider locale={antDesignI18n[lang] as Locale}>
        <PaperProvider>
          {/* @ts-ignore */}
          <Main />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
