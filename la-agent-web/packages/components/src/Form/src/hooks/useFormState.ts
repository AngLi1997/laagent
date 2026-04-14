import { cloneDeep, isFunction } from '@bmos/utils';
import type { FormInstance } from 'ant-design-vue';
import type { DefineComponent, SetupContext } from 'vue';
import { computed, reactive, ref, unref, watch, watchEffect } from 'vue';
import type { Recordable } from '../../../common/types/index';
import { ActionColOptions } from '../enums/common';
import type { ComponentProps, RenderCallbackParams } from '../types';
import type { FormProps } from '../types/bm-form';
import type { AdvanceState } from '../types/hooks';

export type FormState = ReturnType<typeof useFormState>;

export type useFormStateParams = {
  props: FormProps;
  attrs: SetupContext['attrs'];
};

export const useFormState = ({ props, attrs }: useFormStateParams): any => {
  // 将formSchema克隆一份，避免修改原有的formSchema
  // const cloneProps = cloneDeep(props);
  const formPropsRef = ref<FormProps>(cloneDeep(props));
  watch(
    () => props,
    () => {
      formPropsRef.value = cloneDeep(props);
    },
    {
      immediate: true,
    },
  );
  watch(
    () => props.formKey,
    () => {
      formPropsRef.value = cloneDeep(props);
    },
  );
  /** 表单项数据 */
  const formModel = reactive({ ...props.initialValues });
  // 表单默认数据
  const defaultFormValues = reactive({ ...props.initialValues });
  // 缓存的表单值，用于恢复form-item v-if为true后的值
  const cacheFormModel = { ...props.initialValues };
  // 表单实例
  const bmFormRef = ref<FormInstance>();
  // 将所有的表单组件实例保存起来
  const compRefMap = new Map<string, DefineComponent<any>>();
  // 初始时的componentProps，用于updateSchema更新时不覆盖componentProps为函数时的值
  const originComponentPropsFnMap = new Map<string, (opt: RenderCallbackParams) => ComponentProps>();

  const advanceState = reactive<AdvanceState>({
    isAdvanced: true,
    hideAdvanceBtn: false,
    isLoad: false,
    actionSpan: ActionColOptions.Span,
  });

  // 获取表单所有属性
  const getFormProps = computed(() => {
    return {
      ...attrs,
      ...formPropsRef.value,
    } as FormProps;
  });

  // 获取栅栏Row配置
  const getRowConfig = computed((): Recordable => {
    const { baseRowStyle = {}, rowProps } = unref(getFormProps);
    return {
      style: baseRowStyle,
      ...rowProps,
    };
  });

  const getFormActionBindProps = computed((): Recordable => ({ ...getFormProps.value, ...advanceState }));
  watchEffect(() => {
    formPropsRef.value.schemas?.forEach((item: any) => {
      if (isFunction(item.componentProps)) {
        originComponentPropsFnMap.set(item.field, item.componentProps);
      }
    });
  });

  const formSchemasRef = computed(() => {
    return formPropsRef.value.schemas || [];
  });

  return {
    formModel,
    defaultFormValues,
    bmFormRef,
    formPropsRef,
    cacheFormModel,
    compRefMap,
    getFormProps,
    advanceState,
    getRowConfig,
    getFormActionBindProps,
    originComponentPropsFnMap,
    formSchemasRef,
  };
};
