import { InjectionKey } from 'vue';
import { ConfigProviderInjection } from '../types';

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}
export const configProviderInjectionKey = createInjectionKey<ConfigProviderInjection>('bmos-config-provider');
export const bmosPropsKey = createInjectionKey('bmos-props');
