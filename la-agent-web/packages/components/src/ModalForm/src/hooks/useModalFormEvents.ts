import type { ModalFormEmitFn, ModalFormProps } from '../..';
import type { Recordable } from '../../../common/types/index';
import type { ModalFormMethods } from './useModalFormMethods';
import type { ModalFormState } from './useModalFormState';
import { isAsyncFunction, isFunction, throttle } from '@bmos/utils';

export type ModalFormEvents = ReturnType<typeof useModalFormEvents>;

type UseModalFormMethodContext = ModalFormState &
  ModalFormMethods & {
    emit: ModalFormEmitFn;
    props: ModalFormProps;
  };

export function useModalFormEvents(modalFormMethodContext: UseModalFormMethodContext) {
  const { props, innerOpen, emit, resetForm, modalFormPropsRef, validate, confirmLoading } = modalFormMethodContext;
  /**
   * @description 确认
   */
  const ok = throttle(async () => {
    const submitFun = modalFormPropsRef.value.submit;
    if (submitFun && (isFunction(submitFun) || isAsyncFunction(submitFun))) {
      try {
        confirmLoading.value = true;
        const res = await validate();
        await submitFun(res as Recordable);
        confirmLoading.value = false;
        if (props.open === undefined) {
          cancel();
        }
      }
      catch (_error) {
        confirmLoading.value = false;
      }
    }
    emit('okModal', modalFormMethodContext);
  }, 300);

  /**
   * @description 取消
   */
  const cancel = () => {
    innerOpen.value = false;
    resetForm();
    emit('update:open', false);
    emit('cancelModal', modalFormMethodContext);
  };

  return {
    ok,
    cancel,
  };
}
