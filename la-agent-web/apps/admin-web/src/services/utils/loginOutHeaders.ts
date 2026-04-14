import { InternalAxiosRequestConfig } from 'axios';

export const handleLoginOutReqHeaders = (config: InternalAxiosRequestConfig) => {
  try {
    if (
      config.url?.includes('/api/app/agent/auth/logout') ||
      config.url?.includes('/api/app/agent/auth/status')
    ) {
      config.headers['terminalType'] = 0;
    }
    return config;
  } catch (error) {
    return config;
  }
};
