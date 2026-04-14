import { inject, provide } from 'vue';
import type { BMFormType } from './';

const key = Symbol('bm-form');

export async function createFormContext(instance: BMFormType) {
  provide(key, instance);
}

export function useFormContext(formProps = {}) {
  return inject(key, formProps) as BMFormType;
}
