import { pathJoin } from './path';
import { quParse, quStringify } from './str';
const urlParse = (url: string) => {
  const anchorEl = document.createElement('a');
  anchorEl.href = url;
  const { protocol, username, password, host, port, hostname, hash, search, pathname: _pathname } = anchorEl;
  const pathname = pathJoin('/', _pathname);
  const auth = username && password ? `${username}:${password}` : '';
  const query = search.replace(/^\?/, '');
  const searchParams = quParse(query);
  const path$1 = `${pathname}${search}`;
  const origin = protocol + '//' + host;
  return {
    protocol,
    auth,
    username,
    password,
    host,
    port,
    hostname,
    hash,
    search,
    searchParams,
    query,
    pathname,
    path: path$1,
    href: url,
    origin,
  };
};

const urlStringify = (url: any) => {
  const { protocol, auth, host, pathname, searchParams, hash } = url;
  const authorize = auth ? `${auth}@` : '';
  const querystring = quStringify(searchParams);
  const search = querystring ? `?${querystring}` : '';
  let hashstring = hash.replace(/^#/, '');
  hashstring = hashstring ? '#' + hashstring : '';
  return `${protocol}//${authorize}${host}${pathname}${search}${hashstring}`;
};

export const urlDelParams = (url: string, removeKeys: Array<string>) => {
  const p = urlParse(url);
  removeKeys.forEach(key => delete p.searchParams[key]);
  return urlStringify(p);
};

export const urlSetParams = (url: string, setter: object) => {
  const p = urlParse(url);
  Object.assign(p.searchParams, setter);
  return urlStringify(p);
};
