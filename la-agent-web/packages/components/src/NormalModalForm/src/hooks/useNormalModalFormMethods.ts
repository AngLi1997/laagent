import type { Recordable } from '../../../common/types/index';
import { NormalModalFormEmitFn } from '../types';
import { NormalModalFormState } from './useNormalModalFormState';

export type NormalModalFormMethods = ReturnType<typeof useNormalModalFormMethods>;

type UseNormalModalFormActionContext = NormalModalFormState & {
  emit: NormalModalFormEmitFn;
};

export function useNormalModalFormMethods(normalNormalModalFormActionContext: UseNormalModalFormActionContext) {
  const { formRef, confirmLoading, innerOpen, formState, normalNormalModalFormPropsRef } =
    normalNormalModalFormActionContext;
  /**
   * @description 重置表单
   */
  const resetForm = () => {
    formRef.value?.resetFields();
  };
  /**
   * @description 获取表单数据
   */
  const getFormValues = () => {
    return formState;
  };
  /**
   * @description 校验表单
   * @returns Promise 返回表单数据
   */
  const validate = async () => {
    try {
      await formRef.value?.validate();
      return formState as Recordable<any>;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * @description 提交表单
   * @param fun 提交表单的方法
   * @returns Promise
   */
  const submit = async (fun: (formModel: Recordable<any>) => Promise<any>) => {
    try {
      confirmLoading.value = true;
      await formRef.value?.validate();
      const result = await fun(formState as Recordable<any>);
      normalNormalModalFormActionContext.emit('update:open', false);
      confirmLoading.value = false;
      return result;
    } catch (error) {
      confirmLoading.value = false;
      return Promise.reject(error);
    } finally {
      confirmLoading.value = false;
    }
  };

  /**
   * @description 设置loading
   * @param loading 是否loading 默认true
   */
  const setLoading = (loading = true) => {
    confirmLoading.value = loading;
  };

  /**
   * @description 内部打开弹窗
   */
  const innerOpenModal = (e: any) => {
    normalNormalModalFormPropsRef.value.preventDefault && e.preventDefault();
    innerOpen.value = true;
  };

  return {
    validate,
    submit,
    resetForm,
    getFormValues,
    setLoading,
    innerOpenModal,
  };
}
