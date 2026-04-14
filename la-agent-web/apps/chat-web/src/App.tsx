import type { ConfigProviderProps } from 'antd';
import type { LoginModalRef } from './components/Login';
import { XProvider } from '@ant-design/x';
import { I18nLanguageEnum } from '@bmos/i18n';
import { App, Spin } from 'antd';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import { Suspense, useEffect, useRef, useState } from 'react';
import Login from './components/Login';
import RouterWrapper from './router';
import { useLoginModalStore } from './stores/loginModalStore';
import { theme } from './styles';
import { getLang, updateLangResource } from './utils/handleLang';
import { getAvatar, getUserInfo } from './utils/user';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import './App.css';

type AntDesignLocaleType = 'zh_CN' | 'en_US' | 'ru_RU';
type AntDesignLocale = {
  [key in AntDesignLocaleType]: any;
};
type Locale = ConfigProviderProps['locale'];

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

const LoadingCom: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Spin size="large" />
    </div>
  );
};

const MyApp: React.FC = () => {
  const lang = getLang() as AntDesignLocaleType;

  const loginRef = useRef<LoginModalRef>(null);

  const { visible } = useLoginModalStore();

  useEffect(() => {
    if (visible) {
      loginRef.current?.showModal();
    }
    else {
      loginRef.current?.handleCancel();
    }
  }, [visible]);

  const [loading, setLoading] = useState(true); // 全局 Loading 状态

  useEffect(() => {
    updateLangResource(localStorage.getItem('lang') || I18nLanguageEnum.ZH_CN).then(async () => {
      try {
        if (localStorage.getItem('BMOS-ACCESS-TOKEN')) {
          await getUserInfo();
          await getAvatar();
        }
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    });
  }, []);

  dayjs.locale(dayjsLocaleMap[lang]);

  if (loading) {
    return <LoadingCom />;
  }

  return (
    <XProvider locale={antDesignI18n[lang] as Locale} theme={theme}>
      <Suspense fallback={<LoadingCom />}>
        <App message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }} style={{ height: '100%' }}>
          <RouterWrapper />
          <Login ref={loginRef} />
        </App>
      </Suspense>
    </XProvider>
  );
};

export default MyApp;
