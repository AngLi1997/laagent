import { isAsyncFunction, isFunction, throttle } from '@bmos/utils';
import { NormalModalFormEmitFn, NormalModalFormProps } from '../..';
import type { Recordable } from '../../../common/types/index';
import { NormalModalFormMethods } from './useNormalModalFormMethods';
import { NormalModalFormState } from './useNormalModalFormState';

export type NormalModalFormEvents = ReturnType<typeof useNormalModalFormEvents>;

type UseNormalModalFormMethodContext = NormalModalFormState &
  NormalModalFormMethods & {
    emit: NormalModalFormEmitFn;
    props: NormalModalFormProps;
  };

export function useNormalModalFormEvents(normalNormalModalFormMethodContext: UseNormalModalFormMethodContext) {
  const { props, innerOpen, emit, resetForm, normalNormalModalFormPropsRef, validate, confirmLoading } =
    normalNormalModalFormMethodContext;
  /**
   * @description 确认
   */
  const ok = throttle(async () => {
    const submitFun = normalNormalModalFormPropsRef.value.submit;
    if (submitFun && (isFunction(submitFun) || isAsyncFunction(submitFun))) {
      try {
        confirmLoading.value = true;
        const res = await validate();
        await submitFun(res as Recordable);
        confirmLoading.value = false;
        if (props.open === undefined) {
          cancel();
        }
      } catch (error) {
        confirmLoading.value = false;
      }
    }
    emit('okModal', normalNormalModalFormMethodContext);
  }, 300);

  /**
   * @description 取消
   */
  const cancel = () => {
    innerOpen.value = false;
    resetForm();
    emit('update:open', false);
    emit('cancelModal', normalNormalModalFormMethodContext);
  };

  return {
    ok,
    cancel,
  };
}
