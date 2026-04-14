import { isEmpty } from '@bmos/utils';
import type { Ref, SetupContext } from 'vue';
import { nextTick, ref, unref, watch } from 'vue';
import BMForm from '../../index';
import type { FormProps, formInstance } from '../types/bm-form';

// @ts-ignore
export function useForm(props?: FormProps): any {
  const formRef = ref<formInstance>({} as formInstance);

  async function getFormInstance() {
    await nextTick();
    const form = unref(formRef);
    if (isEmpty(form)) {
      console.error('未获取表单实例!');
    }
    return form;
  }
  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick();
        const formInstance = await getFormInstance();
        formInstance.setFormProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
      flush: 'post',
    },
  );

  const methods = new Proxy<Ref<formInstance>>(formRef, {
    get(target, key) {
      if (Reflect.has(target, key)) {
        return unref(target);
      }
      if (target.value && Reflect.has(target.value, key)) {
        return Reflect.get(target.value, key);
      }
      // @ts-ignore
      return async (...rest) => {
        const form = await getFormInstance();
        // @ts-ignore
        return form?.[key]?.(...rest);
      };
    },
  });

  const BMFormRender = (
    compProps: Partial<FormProps>,
    { attrs, slots }: SetupContext,
  ) => {
    return (
      <BMForm
        ref={formRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}></BMForm>
    );
  };

  return [BMFormRender, unref(methods)] as const;
}
