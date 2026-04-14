import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { errFeature, FeatureType, Interceptor, reqFeature, resFeature } from './types';
import { isUndefined } from 'lodash-es';
import { ERR_ORDER_SORTER, REQ_ORDER_SORTER, RES_ORDER_SORTER } from './api';

const errorNormalize = (err: any): any => err;

class FeatureManager {
  reqInterceptorList: Array<reqFeature> = [];
  resInterceptorList: Array<resFeature> = [];
  errInterceptorList: Array<errFeature> = [];
  constructor() {
    // __publicField(this, 'reqInterceptorList');
    // __publicField(this, 'resInterceptorList');
    // __publicField(this, 'errInterceptorList');
    this.reqInterceptorList = [];
    this.resInterceptorList = [];
    this.errInterceptorList = [];
  }

  async exec<T>(list: Interceptor, input: T, catchError = false) {
    let prev = input;
    for (let i = 0; i < list.length; i++) {
      const func = list[i];
      try {
        prev = await func(prev);
      }
      catch (_err) {
        console.log(_err, '_err');

        const err = errorNormalize(_err);
        if (catchError) {
          prev = err;
          continue;
        }
        throw err;
      }
    }

    return prev;
  }

  push(feature: FeatureType) {
    const { reqInterceptorList, resInterceptorList, errInterceptorList } = this;
    // @ts-ignore
    if (!isUndefined(feature.reqOrder)) {
      reqInterceptorList.push(feature as unknown as reqFeature);
      reqInterceptorList.sort(REQ_ORDER_SORTER);
    }
    // @ts-ignore
    else if (!isUndefined(feature.resOrder)) {
      resInterceptorList.push(feature as unknown as resFeature);
      resInterceptorList.sort(RES_ORDER_SORTER);
    }
    // @ts-ignore
    else if (!isUndefined(feature.errOrder)) {
      errInterceptorList.push(feature as unknown as errFeature);
      errInterceptorList.sort(ERR_ORDER_SORTER);
    }
  }

  get reqInterceptor() {
    return async (config: InternalAxiosRequestConfig) => {
      try {
        return await this.exec<InternalAxiosRequestConfig>(
          this.reqInterceptorList.map(item => item.reqInterceptor),
          config,
        );
      }
      catch (err: any) {
        err.__CANCEL__ = true;
        err.config = config;
        throw await this.errInterceptor(err);
      }
    };
  }

  get resInterceptor() {
    return async (response: AxiosResponse) => {
      try {
        return await this.exec<AxiosResponse>(
          this.resInterceptorList.map(item => item.resInterceptor),
          response,
        );
      }
      catch (err: any) {
        err.response = response;
        err.request = response.request;
        err.config = response.config;
        throw await this.errInterceptor(err);
      }
    };
  }

  get errInterceptor() {
    return async (error: any) => {
      // if (isFinalFault(error))
      //   throw error;
      throw await this.exec(
        this.errInterceptorList.map(item => item.errInterceptor),
        error,
        true,
      );
    };
  }
}

export default FeatureManager;
