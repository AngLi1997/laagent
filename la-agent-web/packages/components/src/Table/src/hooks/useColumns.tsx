// @ts-nocheck
import { BMIcon } from '@bmos/components';
import { t } from '@bmos/i18n';
import { cloneDeep, isArray, isBoolean, isEmpty } from '@bmos/utils';
import type { Slots } from 'vue';
import { ref, unref, watchEffect } from 'vue';
import type { Key } from '../../../common/types';
import type { TableActionType, TableColumn, TableMethods, TableProps, TableState } from '../../index';
import { TableAction } from '../components';
import { ColumnKeyFlag } from '../types/column';

export type UseTableColumnsContext = {
  state: TableState;
  props: TableProps;
  methods: TableMethods;
  tableAction: TableActionType;
  slots: Slots;
};

function getHeaderSearchData(searchComponent: string, state: TableState) {
  const headerSearchIconObj = {
    Input: 'Search',
    Checkbox: 'Filter',
  };
  return {
    customFilterDropdown: true,
    headerSearchIcon: headerSearchIconObj[searchComponent],
    onFilterDropdownOpenChange: (open: boolean) => {
      if (open && searchComponent === 'Input') {
        setTimeout(() => {
          state.headerSearchInputRef.value.focus();
        }, 100);
      }
    },
  };
}

export const useColumns = ({ state, methods, props, tableAction }: UseTableColumnsContext): any => {
  const innerColumns = ref(props.columns);
  const { getColumnKey } = methods;
  const { getProps, innerWidthMap } = state;
  const useInnerColumns = ref({ ...unref(getProps) }!.columns);

  watchEffect(() => {
    const innerProps = { ...unref(getProps) };
    const columns = cloneDeep(useInnerColumns.value!.filter(n => !n.hideInTable));
    // 是否开启拖拽排序
    if (innerProps?.dragSort && columns.every(item => item.dataIndex !== 'BMOS_SORT')) {
      columns.unshift({
        dataIndex: 'BMOS_SORT',
        title: t('排序'),
        width: 60,
        align: 'center',
        fixed: 'left',
        customRender: () => {
          return <BMIcon type='Move' class='table-drag-icon' />;
        },
      } as TableColumn);
    }

    // 是否添加序号列
    if (innerProps?.showIndex && columns.every(item => item.dataIndex !== 'BMOS_INDEX')) {
      columns.unshift({
        dataIndex: 'BMOS_INDEX',
        title: t('序号'),
        width: 60,
        align: 'center',
        fixed: 'left',
        ...innerProps?.indexColumnProps,
        customRender: ({ index }) => {
          const getPagination = unref(state.paginationRef);
          if (isBoolean(getPagination)) {
            return index + 1;
          }
          const { current = 1, pageSize = 10 } = getPagination!;
          return ((current < 1 ? 1 : current) - 1) * pageSize + index + 1;
        },
      } as TableColumn);
    }
    innerColumns.value = columns.map(item => {
      const rowKey = props.rowKey as string;
      const columnKey = getColumnKey(item) as string;

      // 操作列
      if (item.actions && columnKey === ColumnKeyFlag.ACTION) {
        item.customRender = options => {
          const { record, index } = options;
          return (
            <TableAction
              actions={item.actions!(options, tableAction)}
              rowKey={record[rowKey] ?? index}
              columnParams={options}
              maxActionCount={getProps.value?.maxActionCount}
            />
          );
        };
      }
      return {
        key: item.key ?? (item.dataIndex as Key),
        dataIndex: item.dataIndex ?? (item.key as Key),
        ...(item.headerSearchComponent && getHeaderSearchData(item.headerSearchComponent, state)),
        ...(columnKey !== ColumnKeyFlag.ACTION && { ellipsis: true }),
        width: 200,
        resizable: true,
        ...item,
        ...(innerWidthMap.has(columnKey) && { width: innerWidthMap.get(columnKey) }),
        ...(item.children && {
          children: item.children.map((child: TableColumn) => {
            return {
              key: child.key ?? (child.dataIndex as Key),
              dataIndex: child.dataIndex ?? (child.key as Key),
              ...(child.headerSearchComponent && getHeaderSearchData(child.headerSearchComponent, state)),
              ...(columnKey !== ColumnKeyFlag.ACTION && { ellipsis: true }),
              width: 200,
              resizable: true,
              ...child,
              ...(innerWidthMap.has(columnKey) && {
                width: innerWidthMap.get(columnKey),
              }),
              customRender: col => {
                const { record } = col;
                if (child.customRender) return child.customRender({ tableAction, ...col });
                // 判断值是否为空值
                let value = record[child.dataIndex as string];
                if (isArray(child.dataIndex)) {
                  // 找对象的值, 如果中途找不到值或者链路中有 undefined 则返回空值
                  value = child.dataIndex.reduce((prev, next) => prev?.[next], record);
                }
                if (isEmpty(value)) {
                  return <span class='bmos-table-empty-column'>-</span>;
                } else {
                  return `${value}`;
                }
              },
            };
          }),
        }),
        customRender: col => {
          const { record } = col;
          if (item.customRender) return item.customRender({ tableAction, ...col });
          // 判断值是否为空值
          let value = record[item.dataIndex as string];
          if (isArray(item.dataIndex)) {
            // 找对象的值
            value = item.dataIndex.reduce((prev, next) => prev?.[next], record);
          }
          if (isEmpty(value)) {
            return <span class='bmos-table-empty-column'>-</span>;
          } else {
            return `${value}`;
          }
        },
      } as TableColumn;
    });
  });

  /**
   * @description 添加 column, 一个或多个, 那个 dataIndex 之前 columns 会被添加， 如果没有 dataIndex 则添加到最后
   * @param {TableColumn | TableColumn[]} columns
   */
  const addColumn = (columns: TableColumn | TableColumn[], dataIndex?: string) => {
    const newColumns = Array.isArray(columns) ? columns : [columns];
    const columnsData = cloneDeep(unref(innerColumns));
    if (dataIndex) {
      const index = columnsData.findIndex(item => item.dataIndex === dataIndex || item.key === dataIndex);
      columnsData.splice(index, 0, ...newColumns);
    } else {
      columnsData.push(...newColumns);
    }
    useInnerColumns.value = columnsData;
  };

  /**
   * @description 添加 column, 一个或多个, 那个 dataIndex 之后 columns 会被添加， 如果没有 dataIndex 则添加到最后
   * @param {TableColumn | TableColumn[]} columns
   */
  const addColumnAfter = (columns: TableColumn | TableColumn[], dataIndex?: string) => {
    const newColumns = Array.isArray(columns) ? columns : [columns];
    const columnsData = cloneDeep(unref(innerColumns));
    if (dataIndex) {
      const index = columnsData.findIndex(item => item.dataIndex === dataIndex || item.key === dataIndex);
      columnsData.splice(index + 1, 0, ...newColumns);
    } else {
      columnsData.push(...newColumns);
    }
    useInnerColumns.value = columnsData;
  };

  /**
   * @description 删除 column, 一个或多个, 通过 dataIndex 删除
   * @param {string | string[]} dataIndex
   */
  const removeColumn = (dataIndex: string | string[]) => {
    const columnsData = cloneDeep(unref(useInnerColumns));
    const dataIndexList = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
    const newColumns = columnsData.filter(item => !dataIndexList.includes(item.dataIndex as string));
    useInnerColumns.value = newColumns;
  };

  /**
   * @description 传入 columns 数组， 更新 columns
   * @param {TableColumn | TableColumn[]} columns
   */
  const updateColumn = (columns: TableColumn | TableColumn[]) => {
    const columnsData = cloneDeep({ ...unref(getProps) }!.columns);
    const updateColumns = Array.isArray(columns) ? columns : [columns];
    const newColumns = columnsData.map(item => {
      const index = updateColumns.findIndex(col => col.dataIndex === item.dataIndex);
      if (index === -1) return item;
      return {
        ...item,
        ...updateColumns[index],
      };
    });
    useInnerColumns.value = newColumns;
  };
  /**
   * @description 传入 columns 数组，替换 columns
   * @param {TableColumn | TableColumn[]} columns
   */
  const replaceColumn = (columns: TableColumn | TableColumn[]) => {
    useInnerColumns.value = columns;
  };
  return {
    innerColumns,
    addColumn,
    removeColumn,
    updateColumn,
    replaceColumn,
    addColumnAfter,
  };
};
