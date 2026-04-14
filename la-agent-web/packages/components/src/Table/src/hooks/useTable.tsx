import { isEmpty } from '@bmos/utils';
import type { Ref, SetupContext } from 'vue';
import { nextTick, ref, unref, watch } from 'vue';
import BMTable from '../../index';
import type { TableInstance, TableProps } from '../types';

export function useTable(props?: Partial<TableProps>) {
  const tableRef = ref<TableInstance>({} as TableInstance);

  async function getTableInstance() {
    await nextTick();
    const table = unref(tableRef);
    if (isEmpty(table)) {
      console.error('未获取表格实例!');
    }
    return table;
  }
  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick();
        const tableInstance = await getTableInstance();
        tableInstance?.setProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  const methods = new Proxy<Ref<TableInstance>>(tableRef, {
    get(target, key) {
      if (Reflect.has(target, key)) {
        return unref(target);
      }
      if (target.value && Reflect.has(target.value, key)) {
        return Reflect.get(target.value, key);
      }
      // @ts-ignore
      return async (...rest) => {
        const table = await getTableInstance();
        // @ts-ignore
        return table?.[key]?.(...rest);
      };
    },
  });

  const TableRender = (
    compProps: Partial<TableProps>,
    { attrs, slots }: SetupContext,
  ) => {
    return (
      <BMTable
        ref={tableRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}></BMTable>
    );
  };

  return [TableRender, unref(methods)] as const;
}
