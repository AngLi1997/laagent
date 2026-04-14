import { inject, provide } from 'vue';
import type { NormalModalFormType } from '.';

const key = Symbol('modal-form');

export async function createNormalModalFormContext(instance: NormalModalFormType) {
  provide(key, instance);
}

export function useNormalModalFormContext(normalNormalModalFormProps = {}) {
  return inject(key, normalNormalModalFormProps) as NormalModalFormType;
}
