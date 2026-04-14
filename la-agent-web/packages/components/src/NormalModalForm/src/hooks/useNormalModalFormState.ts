import type { FormInstance } from 'ant-design-vue';
import type { SetupContext } from 'vue';
import type { Recordable } from '../../../common/types';
import type { NormalModalFormEmitFn, NormalModalFormProps } from '../types';
import { cloneDeep, deepMerge } from '@bmos/utils';
import { computed, reactive, ref, watch } from 'vue';
import { defaultNormalModalFormProps } from '../types';

export type NormalModalFormState = ReturnType<typeof useNormalModalFormState>;

export interface useNormalModalFormStateParams {
  props: NormalModalFormProps;
  attrs: SetupContext['attrs'];
  emit: NormalModalFormEmitFn;
}

export const useNormalModalFormState = ({
  props,
  attrs,
  emit,
}: useNormalModalFormStateParams): any => {
  const cloneProps = cloneDeep(props);
  const normalNormalModalFormPropsRef = ref<NormalModalFormProps>(cloneProps as NormalModalFormProps);
  // normalNormalModalForm 实例
  const normalModalFormRef = ref<any>();
  // 表单实例
  const formRef = ref<FormInstance>();
  // 内部控制 modal 的显示
  const innerOpen = ref<boolean>(false);
  // form 数据
  const formState = reactive<Recordable>({});
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
    (v) => {
      emit('update:open', v as boolean);
    },
    { immediate: true },
  );

  // props.open 是否为 undefined
  const openUndefined = ref<boolean>(false);
  watch(
    () => props.open,
    (v) => {
      if (v === undefined) {
        openUndefined.value = true;
      }
    },
    { immediate: true },
  );

  watch(
    () => props,
    (v) => {
      if (v && props.formProps) {
        normalNormalModalFormPropsRef.value = cloneDeep(props);
        const formProps = deepMerge(
          { ...defaultNormalModalFormProps },
          { ...v.formProps },
        );
        // @ts-ignore
        normalNormalModalFormPropsRef.value.formProps = formProps;
      }
    },
    { immediate: true, deep: true },
  );

  // 获取所有属性
  const getNormalModalFormProps = computed(() => {
    return {
      ...attrs,
      ...normalNormalModalFormPropsRef.value,
    } as NormalModalFormProps;
  });

  // 提交 loading
  const confirmLoading = ref<boolean>(false);

  // 获取 trigger 按钮的属性
  const getTriggerButtonProps = computed(() => {
    const triggerProps = {
      ...normalNormalModalFormPropsRef.value.triggerButtonProps,
    };
    return triggerProps;
  });

  // 打开 modal 时重置表单
  watch(
    () => props.open,
    (v) => {
      if (v) {
        formRef.value?.resetFields();
      }
    },
    { immediate: false },
  );
  return {
    formState,
    normalNormalModalFormPropsRef,
    normalModalFormRef,
    formRef,
    openRef,
    getNormalModalFormProps,
    confirmLoading,
    openUndefined,
    innerOpen,
    getTriggerButtonProps,
  };
};
