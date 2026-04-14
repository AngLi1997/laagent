import { handleLoginOutReqHeaders } from '@/services/utils/loginOutHeaders';
import { BMOSAxiosInstance, createBmosAxios, processFault, USER_LOCK_REQ_ORDER, userToken } from '@bmos/axios';
import { app, lockScreen, sso } from '@bmos/messager';
import { isFunction } from '@bmos/utils';
import { InternalAxiosRequestConfig } from 'axios';
import { handleLogReqHeaders } from './utils/logHeaders';

const request: BMOSAxiosInstance = createBmosAxios({
  baseURL: '/api/app',
})
  .feat.use(userToken({ ssoMessenger: sso }))
  .use(processFault({ appMessenger: app }))
  .use([
    {
      reqOrder: USER_LOCK_REQ_ORDER,
      reqInterceptor(req: InternalAxiosRequestConfig) {
        const { lockMessage } = lockScreen;
        if (isFunction(lockMessage) && req.url !== '/api/app/platform/message/wait/task/count') {
          lockMessage();
        }
        return req;
      },
    },
  ])
  .use([
    {
      reqOrder: 5,
      reqInterceptor: handleLogReqHeaders,
    },
  ])
  .use([
    {
      reqOrder: 6,
      reqInterceptor: handleLoginOutReqHeaders,
    },
  ])
  .end();

export default request;
