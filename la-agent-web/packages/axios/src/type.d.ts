import axios from 'axios';
import { create } from './types';
declare const BMOSAxios: {
    create: typeof create;
    Cancel: import("axios").CancelStatic;
    CancelToken: import("axios").CancelTokenStatic;
    Axios: typeof import("axios").Axios;
    AxiosError: typeof import("axios").AxiosError;
    HttpStatusCode: typeof import("axios").HttpStatusCode;
    VERSION: string;
    isCancel: typeof import("axios").isCancel;
    all: typeof import("axios").all;
    spread: typeof import("axios").spread;
    isAxiosError: typeof import("axios").isAxiosError;
    toFormData: typeof import("axios").toFormData;
    formToJSON: typeof import("axios").formToJSON;
    CanceledError: typeof import("axios").CanceledError;
    AxiosHeaders: typeof import("axios").AxiosHeaders;
    defaults: Omit<import("axios").AxiosDefaults<any>, "headers"> & {
        headers: import("axios").HeadersDefaults & {
            [key: string]: import("axios").AxiosHeaderValue;
        };
    };
    interceptors: {
        request: import("axios").AxiosInterceptorManager<import("axios").InternalAxiosRequestConfig<any>>;
        response: import("axios").AxiosInterceptorManager<import("axios").AxiosResponse<any, any>>;
    };
};
export default BMOSAxios;