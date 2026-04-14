import { InternalAxiosRequestConfig } from 'axios';
export type Obj = {
  type?: number;
  business?: string;
  export?:(config: InternalAxiosRequestConfig)=> Pick<Obj,'type'|'business'>
};
export type log = Record<string, Obj>;
