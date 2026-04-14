import type { NormalModalFormEvents } from './useNormalModalFormEvents';
import type { NormalModalFormState } from './useNormalModalFormState';
import type { NormalModalFormMethods } from './useNormalModalFormMethods';

export * from './useNormalModalFormContext';
export * from './useNormalModalFormEvents';
export * from './useNormalModalFormState';
export * from './useNormalModalFormMethods';

export type NormalModalFormType = NormalModalFormState & NormalModalFormEvents & NormalModalFormMethods;
