import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { errFeature, MessageInstance, reqFeature, resFeature, userTokenType } from '../types';
import axios from 'axios';
import { isFunction } from 'lodash-es';
import {
  PROCESS_FAULT_ERR_ORDER,
  STANDARD_ERR_ORDER,
  STANDARD_REQ_LANG,
  STANDARD_REQ_ORDER,
  STANDARD_RES_ORDER,
  SUCCESS,
  USER_LOCK_REQ_ORDER,
  USER_TOKEN_NAME,
  USER_TOKEN_REQ_ORDER,
} from '../common';
import { getLang, getProp, isOriginal, maybeFormData } from '../utils';

const jsonMIME = 'application/json;';

export const reqStandard = (obj: { platform: string; lang: string }): reqFeature => {
  return {
    reqOrder: STANDARD_REQ_ORDER,
    reqInterceptor(req: InternalAxiosRequestConfig) {
      const { method = 'get', headers } = req;
      const isGetMethod = method.toUpperCase() === 'GET';
      headers.accept = jsonMIME;
      const lang = getLang(obj);
      headers[STANDARD_REQ_LANG] = lang;
      req.headers = headers;
      req.method = method;
      // setApiVersion(req);
      if (isGetMethod)
        return req;
      const { data = {} } = req;
      if (!headers['content-type'] && !maybeFormData(data)) {
        headers['content-type'] = jsonMIME;
        req.data = JSON.stringify(data);
      }
      return req;
    },
  };
};

export const resStandard = (): resFeature => {
  return {
    resOrder: STANDARD_RES_ORDER,
    resInterceptor(res: AxiosResponse) {
      const { code = 0 } = res.data;
      if (code !== 0 && code !== SUCCESS)
        // eslint-disable-next-line no-throw-literal
        throw { ...res.data, res };
      // const data = getApiVersion(res.config) === "1.0" ? res.data : res.data.data;
      if (isOriginal(res.config))
        return res;
      return res.data;
    },
  };
};

export const errStandard = (): errFeature => {
  return {
    errOrder: STANDARD_ERR_ORDER,
    errInterceptor(err: any) {
      const { config, request, response } = err;
      const { defaultErrorMessage = '网络连接有点问题，请稍后再试' } = config;
      const isCancel = axios.isCancel(err);
      if (isCancel || !request || !response) {
        // eslint-disable-next-line no-throw-literal
        throw { ...err, code: 'CANCELED' };
      }
      const resData = response.data;
      const message = getProp(resData, 'message') ?? defaultErrorMessage;
      // eslint-disable-next-line no-throw-literal
      throw {
        ...err,
        code: resData.code,
        status: response.status,
        message,
      };
    },
  };
};

export const reqUserToken = (options: userTokenType): reqFeature => {
  const { ssoMessenger } = options || {};
  return {
    reqOrder: USER_TOKEN_REQ_ORDER,
    reqInterceptor(req: InternalAxiosRequestConfig) {
      if (!ssoMessenger)
        return req;
      const { getUserToken, requestHeaderName } = ssoMessenger;
      if (req.headers && !req.headers[requestHeaderName]) {
        const token = getUserToken();
        req.headers[requestHeaderName] = token;
        if (USER_TOKEN_NAME !== requestHeaderName) {
          req.headers[USER_TOKEN_NAME] = token;
        }
      }
      return req;
    },
  };
};

export const reqMessageInstance = (options: MessageInstance): reqFeature => {
  const { messenger } = options || {};
  return {
    reqOrder: USER_LOCK_REQ_ORDER,
    reqInterceptor(req: InternalAxiosRequestConfig) {
      if (!messenger)
        return req;
      const { lockMessage } = messenger;
      if (isFunction(lockMessage)) {
        lockMessage();
      }
      return req;
    },
  };
};

export const standard = (obj: { platform: string; lang: string }) => [reqStandard(obj), resStandard(), errStandard()];

// 添加白名单
export const whileRoutes = ['/app/bmos-ai/login/index.html'];

export const errProcess = (options: any) => {
  const options2 = options || {};
  const { processor, appMessenger, beforeLogin } = options2;
  return {
    errOrder: PROCESS_FAULT_ERR_ORDER,
    async errInterceptor(fault: any) {
      if (appMessenger) {
        const { status, code } = fault;
        if (status === 401 || status === 403) {
          if (whileRoutes.includes(window.location.pathname))
            return;
          if (isFunction(beforeLogin))
            await beforeLogin(fault);
          appMessenger.navigatorLoginPage();
          throw fault;
        }
        if (code === 'license.invalid' || code === 1040403) {
          appMessenger.licenseInvalid();
          throw fault;
        }
      }
      if (isFunction(processor))
        await processor(fault);
      throw fault;
    },
  };
};

export const userToken = (options: userTokenType) => {
  if (!options.ssoMessenger)
    throw new Error(`userToken 特性需要传入 ssoMessenger 属性`);
  return [reqUserToken(options)];
};

export const lockPost = (options: MessageInstance) => {
  if (!options.messenger)
    throw new Error(`lockPost 特性需要传入 messenger 属性`);
  return [reqMessageInstance(options)];
};

export const RES_ORDER_SORTER = (a: resFeature, b: resFeature) => a.resOrder - b.resOrder;
export const REQ_ORDER_SORTER = (a: reqFeature, b: reqFeature) => a.reqOrder - b.reqOrder;
export const ERR_ORDER_SORTER = (a: errFeature, b: errFeature) => a.errOrder - b.errOrder;

export const processFault = (options: any) => [errProcess(options)];
// export const appToken = (options) => [reqAppToken()];
