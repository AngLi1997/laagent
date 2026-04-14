import { Ref, inject, shallowRef } from 'vue';
import { configProviderInjectionKey } from '../ConfigProvider/src/hooks/context';
import { defaultClsPrefix } from '../common/const';

export function useClsPrefix(): Ref<string> {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  return NConfigProvider
    ? NConfigProvider.clsPrefixRef
    : shallowRef(defaultClsPrefix);
}
