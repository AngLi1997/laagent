import router from '@/router';
import { InternalAxiosRequestConfig } from 'axios';
import { FUNCTION, HeadersEnum, LogMenuId, LogOperation, LogOperationBusiness, SPLIT } from '../enum';
import { Obj } from '../enum/type';

const handleURL = (
  config: InternalAxiosRequestConfig,
  split: string = SPLIT,
  type: boolean = true,
): InternalAxiosRequestConfig['url'] => {
  const urls = config.url?.split(split);
  if (type) {
    urls?.pop();
    return urls?.join(split);
  }
  return urls?.shift();
};

const getLogEnum = (en: Record<string, Obj>, config: InternalAxiosRequestConfig): Obj => {
  const key = config.url as string;
  if (en[key]) return en[key];
  const questionKey = handleURL(config, '?', false)!;
  if (en[questionKey]) return en[questionKey];
  const hKey = handleURL(config)!;
  if (en[hKey]) return en[hKey];
  return {};
};

export const handleLogReqHeaders = (config: InternalAxiosRequestConfig) => {
  const currentRoute = router.currentRoute.value;
  const menuId: string = currentRoute.meta?.id as string;
  const logEnum = HeadersEnum[menuId];

  if (!logEnum || !menuId) return config;

  const setHeader = (type: number, business: string) => {
    config.headers[LogMenuId] = menuId;
    config.headers[LogOperation] = type;
    config.headers[LogOperationBusiness] = encodeURIComponent(business || '');
  };

  try {
    if (menuId) {
      const LOG = getLogEnum(logEnum, config);
      if (LOG.export && typeof LOG.export === FUNCTION) {
        const { type, business } = LOG.export(config);
        if (type !== void 0 && business) setHeader(type, business);
      } else if (LOG.type !== void 0 && LOG.business) {
        setHeader(LOG.type, LOG.business);
      }
    }
  } catch (error) {
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return config;
  }
};
