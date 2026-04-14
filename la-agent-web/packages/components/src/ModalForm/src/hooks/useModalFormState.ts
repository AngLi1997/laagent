import { cloneDeep, deepMerge } from '@bmos/utils';
import { SetupContext, computed, ref, watch } from 'vue';
import { FormProps, formInstance } from '../../../Form';
import type { ModalFormEmitFn, ModalFormProps } from '../types';
import { defaultFormProps } from '../types';

export type ModalFormState = ReturnType<typeof useModalFormState>;

export type useModalFormStateParams = {
  props: ModalFormProps;
  attrs: SetupContext['attrs'];
  emit: ModalFormEmitFn;
};

// @ts-ignore
export const useModalFormState = ({ props, attrs, emit }: useModalFormStateParams) => {
  const cloneProps = cloneDeep(props);
  const modalFormPropsRef = ref<ModalFormProps>(cloneProps as ModalFormProps);
  // modalForm 实例
  const modalFormRef = ref<any>();
  // 表单实例
  const formRef = ref<formInstance>();
  const formModal = ref<Recordable>({});
  // 内部控制 modal 的显示
  const innerOpen = ref<boolean>(false);
  // 是否打开 modal
  const openRef = computed({
    get() {
      return props.open ?? innerOpen.value;
    },
    set(val) {
      emit('update:open', val as boolean);
    },
  });

  watch(
    () => innerOpen.value,
    v => {
      emit('update:open', v as boolean)
    },
    { immediate: true },
  );
  // props.open 是否为 undefined
  const openUndefined = ref<boolean>(false);
  watch(
    () => props.open,
    v => {
      if (v === undefined) {
        openUndefined.value = true;
      }
    },
    { immediate: true },
  );

  // 是否为双层弹窗
  watch(
    () => props,
    v => {
      if (v && props.formProps) {
        modalFormPropsRef.value = cloneDeep(props);
        const newDefaultFormProps: Record<any, any> = cloneDeep(defaultFormProps);
        const formProps = deepMerge(newDefaultFormProps, {
          ...v.formProps,
        }) as FormProps;
        // @ts-ignore
        modalFormPropsRef.value.formProps = formProps;
      }
    },
    { immediate: true, deep: true },
  );

  // 获取所有属性
  const getModalFormProps = computed(() => {
    return {
      ...attrs,
      ...modalFormPropsRef.value,
    } as ModalFormProps;
  });

  // 提交 loading
  const confirmLoading = ref<boolean>(false);

  // 获取 trigger 按钮的属性
  const getTriggerButtonProps = computed(() => {
    const triggerProps = {
      ...modalFormPropsRef.value.triggerButtonProps,
    };
    return triggerProps;
  });

  // 打开 modal 时重置表单
  watch(
    () => props.open,
    v => {
      if (v) {
        formRef.value?.resetForm();
      }
    },
    { immediate: false },
  );
  return {
    modalFormPropsRef,
    modalFormRef,
    formRef,
    openRef,
    getModalFormProps,
    confirmLoading,
    openUndefined,
    innerOpen,
    getTriggerButtonProps,
    formModal,
  };
};
