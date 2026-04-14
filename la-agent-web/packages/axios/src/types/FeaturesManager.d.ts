import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
export interface FeaturesManager {
  reqInterceptorList: Array<Function>;
  resInterceptorList: Array<Function>;
  errInterceptorList: Array<Function>;
}

export type reqInterceptor = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig;

export type resInterceptor = (res: AxiosResponse) => AxiosResponse | any;

export type errInterceptor = (err: any) => any;

export interface reqFeature {
  reqOrder: number;
  reqInterceptor: reqInterceptor;
}

export interface resFeature {
  resOrder: number;
  resInterceptor: resInterceptor;
}

export interface errFeature {
  errOrder: number;
  errInterceptor: errInterceptor;
}

export type Interceptor = Array<
  reqInterceptor | resInterceptor | errInterceptor
>;

export type FeatureType = reqFeature | resFeature | errFeature;

export type FeatureList = Array<FeatureType>;
