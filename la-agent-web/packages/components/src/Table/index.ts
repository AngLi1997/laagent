import type { DefineComponent, Ref } from 'vue';
import BMTable from './src/table.vue';
import type { TableInstance, TableProps } from './src/types';
export { BMTable };

export * from './src/hooks/';
export * from './src/types/';

export type TableRef = Ref<TableInstance>;

export default BMTable as unknown as DefineComponent<TableProps>;
