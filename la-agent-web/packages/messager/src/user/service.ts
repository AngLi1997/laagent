import { isObject } from '@bmos/utils';
import { requestHeaderName } from '../const';
import { getUserToken } from './info';

async function request(url: string, token: string) {
  token = token || getUserToken();
  const resp = await fetch(url, {
    method: 'GET',
    // @ts-ignore
    headers: {
      token,
      [requestHeaderName]: token,
      terminalType: url === '/api/app/agent/auth/status' ? 0 : undefined,
    },
  });
  if (resp.status !== 200)
    throw new Error(resp.statusText);
  const json = await resp.json();
  if (!isObject(json))
    throw new Error('接口响应异常：响应内容必须是对象格式');
  const { code, data, message } = json as any;
  if (code !== 0)
    throw new Error(message || `接口响应异常：响应码为 ${code}`);
  return data;
}

const defaultRequestAuth = async (token: string, configs: any) => {
  return await request(configs.ssoApi, token);
};

export const service = async (configs: any, token: string) => {
  const requestAuth = configs.requestAuth || defaultRequestAuth;
  return await requestAuth(token, configs);
};
