import { InternalAxiosRequestConfig } from 'axios';

export const handleLoginOutReqHeaders = (config: InternalAxiosRequestConfig) => {
  try {
    if (
      config.url?.includes('/api/app/platform/user/logout') ||
      config.url?.includes('/api/app/platform/user/status')
    ) {
      // headers 添加 terminalType 为 0
      config.headers['terminalType'] = 0;
    }
    return config;
  } catch (error) {
    return config;
  }
};
