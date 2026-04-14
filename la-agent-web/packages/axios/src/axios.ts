import type { BMOSAxiosInstance, BMOSAxiosStatic, CreateAxiosDefaults } from 'axios';
import type { FeatureList, features } from './types';
import axios from 'axios';
import { once } from 'lodash-es';
import qs from 'qs';
import { lockPost, processFault, standard, userToken, whileRoutes } from './api';
import FeatureManager from './Features';
import { errorNormalize } from './utils';

export type { Axios, AxiosRequestConfig, AxiosResponse, AxiosStatic, BMOSAxiosInstance, BMOSAxiosStatic } from 'axios';
export { lockPost, processFault, userToken, whileRoutes };

function wrapResolve(transmit: boolean, errorWrapper: Function, func?: Function | null) {
  return func
    ? async (result: any) => {
      try {
        if (transmit)
          return (await func(result)) || result;
        else return await func(result);
      }
      catch (throwError) {
        throw errorWrapper(result, errorNormalize(throwError));
      }
    }
    : (config: any) => Promise.resolve(config);
}

function wrapReject(func2: any) {
  const errorWrapper = (axiosError: any, throwError: any) => {
    throwError.config = axiosError.config;
    throwError.request = axiosError.request;
    throwError.request = axiosError.response;
    return throwError;
  };
  return func2
    ? async (axiosError: any) => {
      try {
        await func2(axiosError);
      }
      catch (throwError) {
        throw errorWrapper(axiosError, throwError);
      }
    }
    : (err: any) => Promise.reject(err);
}

const create = (config: CreateAxiosDefaults & { extraParams: any }): BMOSAxiosInstance => {
  const bmosAxios: BMOSAxiosInstance = axios.create({
    paramsSerializer(params) {
      // return qs.qsStringify(params);
      return qs.stringify(params, { arrayFormat: 'comma' });
    },
    timeout: 1000 * 60 * 100,
    ...(config || {}),
  });
  const fm = new FeatureManager();
  const useInterceptors = once(() => {
    bmosAxios.interceptors.request.use(fm.reqInterceptor);
    bmosAxios.interceptors.response.use(fm.resInterceptor, fm.errInterceptor);
    features.use(standard(config.extraParams || { platform: 'windows' }));
  });
  const features: features = {
    use(featureList: FeatureList) {
      useInterceptors();
      featureList.forEach(fe => fm.push(fe));
      return features;
    },
    end() {
      return bmosAxios;
    },
  };
  const requestInterceptorManager = bmosAxios.interceptors.request;
  const responseInterceptorManager = bmosAxios.interceptors.response;
  const originRequestInterceptorManagerUse = requestInterceptorManager.use;
  const originResponseInterceptorManagerUse = responseInterceptorManager.use;
  requestInterceptorManager.use = function (resolve, reject, options) {
    resolve = wrapResolve(
      true,
      (config2: any, throwError: any) => {
        throwError.config = config2;
        return throwError;
      },
      resolve,
    );
    reject = wrapReject(reject);
    return originRequestInterceptorManagerUse.call(this, resolve, reject, options);
  };
  responseInterceptorManager.use = function (resolve, reject) {
    resolve = wrapResolve(
      false,
      (result: any, throwError: any) => {
        const response = result;
        throwError.config = response.config;
        throwError.request = response.request;
        throwError.response = response;
        return throwError;
      },
      resolve,
    );
    reject = wrapReject(reject);
    return originResponseInterceptorManagerUse.call(this, resolve, reject);
  };
  bmosAxios.feat = features;
  // bmosAxios.originalRequest = async (config2) => {
  //   setOriginal(config2);
  //   return bmosAxios.request(config2);
  // };
  return bmosAxios;
};

export const bmosAxios: BMOSAxiosStatic = {
  ...axios,
  create,
} as BMOSAxiosStatic;

export default bmosAxios;
export { create as createBmosAxios };

// export const createBmosAxios = create;
