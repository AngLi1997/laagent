import 'axios';
import { features, ResData } from './types';
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: ResData<T>;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
  }

  export interface AxiosRequestConfig extends AxiosRequestConfig {
    // 定义 axios 请求配置的其他属性
    // 例如：headers, params, baseURL, 等等
  }

  export interface BMOSAxiosInstance extends AxiosInstance {
    feat?: features;
    <T = any>(config: AxiosRequestConfig): Promise<ResData<T>>;
    <T>(url: string, config?: AxiosRequestConfig): Promise<ResData<T>>;
    request<T>(config: AxiosRequestConfig): Promise<ResData<T>>;
    // 可以添加 axios 实例的其他方法和属性
    // 例如：get, post, put, delete, interceptors, 等等
  }

  export interface BMOSAxiosStatic extends AxiosStatic {
    create(config?: CreateAxiosDefaults): BMOSAxiosInstance;
  }

  const axios: AxiosStatic;
  export default axios;
}
