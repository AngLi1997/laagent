import type { BMOSAxiosInstance } from '@bmos/axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { createBmosAxios, PROCESS_FAULT_ERR_ORDER, USER_TOKEN_NAME, USER_TOKEN_REQ_ORDER, whileRoutes } from '@bmos/axios';
import { handleLoginOutReqHeaders } from '@/services/utils/loginOutHeaders';
import { getStoredToken } from '@/utils/token';

const request: BMOSAxiosInstance = createBmosAxios({
  baseURL: window?.$wujie?.props?.apiBase || '/api/app',
})
  .feat
  .use([{
    reqOrder: USER_TOKEN_REQ_ORDER,
    reqInterceptor(req: InternalAxiosRequestConfig) {
      if (req.headers) {
        const token = getStoredToken();

        if (req.url?.includes('/agent/auth/login')) {
          delete req.headers[USER_TOKEN_NAME];
          return req;
        }

        if (token) {
          req.headers[USER_TOKEN_NAME] = token;
        }
        else {
          delete req.headers[USER_TOKEN_NAME];
        }
      }
      return req;
    },
  }])
  // .use([
  //   {
  //     reqOrder: 5,
  //     reqInterceptor: handleLogReqHeaders,
  //   },
  // ])
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
          if (whileRoutes.includes(window.location.pathname))
            return;
            // 退出登录
          localStorage.removeItem('BMOS-ACCESS-TOKEN');
          sessionStorage.removeItem('BMOS_SSO_USER');
          // 指定跳转到 /main-chat
          window.location.href = `/app/bmos-chat/main-chat?t=${Date.now()}`;
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
