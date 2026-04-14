import type { BMOSAxiosInstance } from '@bmos/axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { handleLoginOutReqHeaders } from '@/services/utils/loginOutHeaders';
import { getItem, removeItem } from '@/utils/mmkv';
import { createBmosAxios, PROCESS_FAULT_ERR_ORDER, STANDARD_REQ_LANG, USER_TOKEN_NAME, USER_TOKEN_REQ_ORDER } from '@bmos/axios';
import Config from 'react-native-config';
import { LANGUAGE_KEY } from '@/types';
import { resetToLogin } from '@/utils/navigationHelper';

const request: BMOSAxiosInstance = createBmosAxios({
  baseURL: `${Config.VITE_API_HOST ?? 'http://172.30.1.160:60300/'}api/app`,
  // 运行环境默认windows，可选mobile、windows
  extraParams: {
    platform: 'mobile',
    lang: getItem(LANGUAGE_KEY) || 'zh_CN',
  },
})
  .feat
  .use([{
    reqOrder: USER_TOKEN_REQ_ORDER,
    reqInterceptor(req: InternalAxiosRequestConfig) {
      if (req.headers) {
        req.headers[USER_TOKEN_NAME] = getItem('BMOS-ACCESS-TOKEN') || '';
      }
      return req;
    },
  }])
  .use([
    {
      reqOrder: 5,
      reqInterceptor(req: InternalAxiosRequestConfig) {
      if (req.headers) {
        req.headers[STANDARD_REQ_LANG] = getItem(LANGUAGE_KEY) || 'zh_CN'
      }
      return req;
    },
    },
  ])
  .use([
    {
      reqOrder: 6,
      reqInterceptor: handleLoginOutReqHeaders,
    },
  ])
  .use([
    {
      errOrder: PROCESS_FAULT_ERR_ORDER,
      async errInterceptor(fault: any) {
        const { status, code } = fault;
        if (status === 401 || status === 403) {
          removeItem('BMOS-ACCESS-TOKEN');
          removeItem('BMOS_SSO_USER');
          // window.location.href = `/app/bmos-chat/main-chat?t=${Date.now()}`;
          resetToLogin()
          return fault;
        }
        if (code === 'license.invalid' || code === 1040403) {
          return fault;
        }
        return fault;
      },
    },
  ])
  .end();

export default request;
