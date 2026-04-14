import type { TableMethods } from './useTableMethods';
import type { TableState } from './useTableState';

export type TableHeaderSearch = {
  tableState: TableState;
  tableMethods: TableMethods;
};

export function useTableHeaderSearch({ tableState, tableMethods }: TableHeaderSearch) {
  const { headerSearchDataRef } = tableState;
  // 表头搜索方法
  const tableHeaderSearch = (confirm: () => void) => {
    tableMethods.fetchData();
    confirm();
  };

  // 清除表头搜索数据
  const clearTableHeaderSearch = () => {
    headerSearchDataRef.value = {};
  };

  return {
    tableHeaderSearch,
    clearTableHeaderSearch,
  };
}
