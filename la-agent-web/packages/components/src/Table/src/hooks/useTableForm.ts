import type { ComputedRef, Slots } from 'vue';
import { computed, unref, watchEffect } from 'vue';
import type { FormProps, FormSchema } from '../../../Form';
import { ColumnKeyFlag } from '../types/column';
import type { TableMethods } from './useTableMethods';
import type { TableState } from './useTableState';

export type UseTableFormContext = {
  tableState: TableState;
  tableMethods: TableMethods;
  slots: Slots;
};

export function useTableForm({ tableState, slots, tableMethods }: UseTableFormContext) {
  const { getProps, loadingRef } = tableState;
  const { getColumnKey, getQueryFormRef } = tableMethods;

  const getFormProps = computed((): FormProps => {
    const { formProps } = unref(getProps);
    const { submitButtonOptions } = formProps || {};
    return {
      showAdvancedButton: true,
      layout: 'vertical',
      // labelWidth: 80,
      ...unref(formProps),
      schemas: formProps?.schemas ?? unref(formSchemas),
      submitButtonOptions: {
        loading: unref(loadingRef),
        ...submitButtonOptions,
      },
    };
  });

  const formSchemas = computed<FormSchema[]>(() => {
    const columnKeyFlags = Object.keys(ColumnKeyFlag);
    return unref(getProps)
      ?.columns?.filter((n: any) => {
        const field = getColumnKey(n);
        return !n.hideInSearch && !!field && !columnKeyFlags.includes(field as string);
      })
      .map((n: any) => {
        return {
          field: n.searchField ?? (getColumnKey(n) as string),
          component: 'Input',
          label: n.title as string,
          colProps: {
            span: unref(getProps)?.formProps?.baseColProps?.span || 6,
          },
          ...n.formItemProps,
        };
      })
      .sort((a: any, b: any) => Number(a?.order) - Number(b?.order)) as FormSchema[];
  });

  // 同步外部对props的修改
  watchEffect(
    () => {
      getQueryFormRef()?.setFormProps(unref(getFormProps));
    },
    {
      flush: 'post',
    },
  );

  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots);
    return keys.map(item => (item.startsWith('form-') ? item : null)).filter((item): item is string => !!item);
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/form-/, '') ?? '';
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
  };
}
