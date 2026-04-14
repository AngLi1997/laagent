import { BMOSAxiosInstance } from 'axios';
import { FeatureList } from './FeaturesManager';
export interface features {
  use: (featList: FeatureList) => features;
  end: () => BMOSAxiosInstance;
}

export interface ResData<T = any> {
  code: number;
  message: string;
  data: T;
}

// export interface BmosAxios extends AxiosStatic {
//   <T>(config: AxiosRequestConfig): Promise<T>;
//   <T>(url: string, config?: AxiosRequestConfig): Promise<T>;
//   request<T>(config: AxiosRequestConfig): Promise<{
//     data: ResData<T>;
//     res: AxiosResponse;
//   }>;
//   originalRequest<T>(config: AxiosRequestConfig): Promise<{
//     data: ResData<T>;
//     res: AxiosResponse;
//   }>;
//   get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
//   delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
//   head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
//   options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
//   post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//   put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//   patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
// }
// export declare function create(config?: CreateAxiosDefaults): BmosAxios;
