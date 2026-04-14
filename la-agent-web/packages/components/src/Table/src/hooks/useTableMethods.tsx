// import { useInfiniteScroll } from '@vueuse/core';
import type { SorterResult } from 'ant-design-vue/es/table/interface';
import type {
  OnChangeCallbackParams,
  OnResizeColumnCallbackParams,
  TableColumn,
  TableEmitFn,
  TableProps,
} from '../types/';
import type { Pagination, TableState } from './useTableState';
import { isArray, isAsyncFunction, isBoolean, isFunction, isObject } from '@bmos/utils';
import { nextTick, unref } from 'vue';

export type TableMethods = ReturnType<typeof useTableMethods>;
export interface UseTableMethodsContext {
  state: TableState;
  props: TableProps;
  emit: TableEmitFn;
}

export const useTableMethods = ({ state, props, emit }: UseTableMethodsContext) => {
  const {
    innerPropsRef,
    tableData,
    loadingRef,
    queryFormRef,
    sortParamsRef,
    paginationRef,
    headerSearchDataRef,
    innerWidthMap,
    tableKey,
  } = state;
  const setProps = (props: Partial<TableProps>) => {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
  };

  /**
   * @description 表格查询
   */
  const handleSubmit = (params: any, page = 1) => {
    if (isObject(paginationRef.value)) {
      paginationRef.value.current = page;
    }
    params.page_num = page;
    fetchData(params);
  };

  const handleReset = (params: any, page = 1) => {
    if (isObject(paginationRef.value)) {
      paginationRef.value.current = page;
    }
    params.page_num = page;
    fetchData(params);
    emit('reset', params);
  };

  /**
   * @param {object} params 表格查询参数
   * @param {OnChangeCallbackParams} rest 是否将页数重置到第一页
   * @description 获取表格数据
   */
  const fetchData = async (params = {}, rest?: OnChangeCallbackParams): Promise<any> => {
    const [pagination] = rest || [];
    // 如果用户没有提供dataSource并且dataRequest是一个函数，那就进行接口请求
    if (
      Object.is(props.dataSource, undefined)
      && (isFunction(props.dataRequest) || isAsyncFunction(props.dataRequest))
    ) {
      await nextTick();
      if (queryFormRef.value) {
        try {
          const values = await queryFormRef.value.validate();
          const { ...newValues } = values;
          params = {
            ...(queryFormRef.value?.handleFormValues(newValues) ?? {}),
            ...params,
          };
        }
        catch (_error) {
          tableData.value = [];
          updatePagination({
            total: 0,
            current: 1,
          });
          throw new Error('表单验证失败');
        }
      }
      const _pagination = unref(paginationRef)!;
      // 是否启用了分页
      const enablePagination = isObject(_pagination);
      const queryParams = {
        ...params,
      };
      // 如果有额外的参数，将额外的参数添加到请求参数中
      if (props.extraParams) {
        Object.assign(queryParams, {
          ...props.extraParams,
        });
      }
      // 如果有表头搜索，将表头搜索数据添加到请求参数中
      if (headerSearchDataRef.value) {
        Object.assign(queryParams, {
          ...headerSearchDataRef.value,
        });
      }
      // 如果有排序，将排序数据添加到请求参数中
      if (sortParamsRef.value) {
        Object.assign(queryParams, {
          ...sortParamsRef.value,
        });
      }
      // 如果启用了分页，将分页信息添加到请求参数中
      if (enablePagination) {
        Object.assign(queryParams, {
          // @ts-ignore
          page_num: _pagination.current,
          // @ts-ignore
          page_size: _pagination.pageSize,
        });
      }
      loadingRef.value = true;
      const _data = await props?.dataRequest?.(queryParams, rest).finally(() => (loadingRef.value = false));
      const data = _data?.data || _data;
      if (data?.total) {
        const { page_num: pageNum, total } = data;

        // @ts-ignore
        // if (enablePagination && _pagination?.current && retryFetchCount-- > 0) {
        if (enablePagination && _pagination?.current) {
          // 有分页时,删除当前页最后一条数据时 自动往前一页查询
          if (data?.data.length === 0 && total > 0 && pageNum > 1) {
            // @ts-ignore
            _pagination.current--;
            return reload(true);
          }
        }
        updatePagination({
          ...(pagination || {}),
          current: pageNum || 1,
          total,
        });
      }
      else if (data?.total === 0) {
        updatePagination({
          ...(pagination || {}),
          total: 0,
          current: 1,
        });
      }
      else {
        updatePagination(pagination);
      }
      if (Array.isArray(data?.data)) {
        tableData.value = data?.data;
      }
      else if (Array.isArray(data)) {
        tableData.value = data;
      }
      else {
        tableData.value = [];
        updatePagination({
          total: 0,
          current: 1,
        });
      }
    }
    else {
      updatePagination(pagination);
    }
    return tableData;
  };

  /**
   * @description 刷新表格
   * @param {boolean} resetPageIndex 是否重置页码
   */
  const reload = async (resetPageIndex = false) => {
    const pagination = unref(paginationRef);
    if (Object.is(resetPageIndex, true) && isObject(pagination)) {
      // @ts-ignore
      pagination.current = 1;
    }
    return await fetchData();
  };

  const setSortParams = (sorter: SorterResult) => {
    if (sorter && sorter.column && isBoolean(sorter.column.sorter)) {
      const { column, order } = sorter;
      const { dataIndex } = column;
      sortParamsRef.value = {
        orderBy: dataIndex,
        dir: order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : undefined,
      };
    }
    else {
      sortParamsRef.value = {};
    }
  };

  /**
   * @description 分页改变
   * @param {OnChangeCallbackParams} rest 分页信息
   */
  const handleTableChange = async (...rest: OnChangeCallbackParams) => {
    // const [pagination, filters, sorter] = rest;
    const [pagination, _filters, sorter] = rest;
    if (queryFormRef.value) {
      await queryFormRef.value.validate();
    }
    // TODO 后端接口不支持 多列排序， 目前只支持单列排序
    setSortParams(sorter as SorterResult);
    // 切换 pageSize 页码回到第一页
    if (pagination.pageSize && pagination.pageSize !== paginationRef.value.pageSize && props.pageSizeChangeToFirst) {
      pagination.current = 1;
    }
    updatePagination(pagination);
    await fetchData({}, rest);
    emit('change', ...rest);
  };

  // dataIndex 可以为 a.b.c
  // const getDataIndexVal = (dataIndex, record) => dataIndex.split('.').reduce((pre, curr) => pre[curr], record)

  /**
   * @description 获取表格列key
   * @param {object} column 表格列配置
   */
  const getColumnKey = (column: TableColumn) => {
    return (column?.key || column?.dataIndex) as string;
  };

  /**
   * @description 根据 dataIndex 设置 headerSearchDataRef 的值
   * @param {Record<string, any> | Array<Record<string, any>>} data 表格列搜索值
   */
  const updateHeaderSearchData = (data: Record<string, any> | Array<Record<string, any>>) => {
    let updateData: Array<Record<string, any>> = [];
    if (isObject(data)) {
      updateData.push(data as Record<string, any>);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    headerSearchDataRef.value = {
      ...headerSearchDataRef.value,
      ...updateData.reduce((pre, curr) => {
        Object.keys(curr).forEach((key) => {
          pre[key] = curr[key];
        });
        return pre;
      }, {}),
    };
    fetchData();
  };

  /**
   * @description 更新表格分页信息
   * @param {Pagination} info 分页信息
   */
  const updatePagination = (info: Pagination = paginationRef.value) => {
    if (isBoolean(info)) {
      paginationRef.value = info;
    }
    else if (isObject(paginationRef.value)) {
      paginationRef.value = {
        ...paginationRef.value,
        ...info,
      };
    }
  };
  // /** 表格无限滚动 */
  // const onInfiniteScroll = (
  //   callback: UseInfiniteScrollParams[1],
  //   options?: UseInfiniteScrollParams[2],
  // ) => {
  //   const el =
  //     getCurrentInstance()?.proxy?.$el.querySelector('.ant-table-body');
  //   useInfiniteScroll(el, callback, options);
  // };

  /**
   * @description 当外部需要动态改变搜索表单的值或选项时，需要调用此方法获取formRef实例
   */
  const getQueryFormRef = () => queryFormRef.value;

  const handleResizeColumn = (...rest: OnResizeColumnCallbackParams) => {
    const [w, col] = rest;
    col.width = w;
    innerWidthMap.set(col.dataIndex as string, w);
    emit('resizeColumn', ...rest);
  };

  /**
   * @description 重新渲染表格
   */
  const reRenderTable = () => {
    tableKey.value = new Date().getTime();
  };

  /**
   * @description 获取表格数据
   */
  const getTableData = () => tableData.value;

  /**
   * @description 根据 rowKey 更新表格数据中 row 的 某个 dataIndex 的值
   * @param {string} rowKey 行的唯一标识
   * @param {string} rowKeyValue 行的唯一标识的值
   * @param {string} dataIndex 列的唯一标识
   * @param {any} value 更新的值
   */
  const updateTableData = (rowKey: string, rowKeyValue: string, dataIndex: string, value: any) => {
    const index = tableData.value.findIndex((item: any) => item[rowKey] === rowKeyValue);
    if (index !== -1) {
      tableData.value[index][dataIndex] = value;
    }
  };

  return {
    setProps,
    handleSubmit,
    handleTableChange,
    getColumnKey,
    fetchData,
    getQueryFormRef,
    reload,
    // onInfiniteScroll,
    updatePagination,
    handleReset,
    handleResizeColumn,
    updateHeaderSearchData,
    reRenderTable,
    getTableData,
    updateTableData,
  };
};
