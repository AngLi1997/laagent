import { t } from '@bmos/i18n';
import { omit } from '@bmos/utils';
import type { TableProps as AntTableProps, InputProps, Table } from 'ant-design-vue';
import type { Slots } from 'vue';
import { computed, inject, ref, unref, watch } from 'vue';
import { ConfigProviderInjection, configProviderInjectionKey } from '../../../ConfigProvider';
import type { formInstance } from '../../../Form';
import type { Key, Recordable } from '../../../common/types';
import type { SortParams, TableEmitFn, TableProps } from '../types';
import { useScroll } from './useScroll';

export type Pagination = AntTableProps['pagination'];
export type TableState = ReturnType<typeof useTableState>;

export type UseTableStateParams = {
  props: TableProps;
  slots: Slots;
  emit: TableEmitFn;
};

// @ts-ignore
export const useTableState = ({ props, emit }: UseTableStateParams): any => {
  const tableKey = ref<number>(1);
  // 获取configProvider的 前缀
  const provideConfig: ConfigProviderInjection = inject(configProviderInjectionKey) as ConfigProviderInjection;
  /** 滚动配置 */
  const { scroll } = useScroll({
    props,
    clsPrefixRef: provideConfig?.clsPrefixRef,
  });
  /** 表格实例 */
  const tableRef = ref<InstanceType<typeof Table>>();
  /** 查询表单实例 */
  const queryFormRef = ref<formInstance>();
  /** 表头搜索输入框实例 */
  const headerSearchInputRef = ref<InputProps>();
  /** 表头搜索数据 */
  const headerSearchDataRef = ref<any>({});
  /** 表格排序对象 */
  const sortParamsRef = ref<SortParams>({} as SortParams);
  /** 表格数据 */
  const tableData = ref<any[]>([]);
  /** 内部属性 */
  const innerPropsRef = ref<Partial<TableProps>>();
  /** 分页配置参数 */
  const paginationRef = ref<NonNullable<Pagination>>(false);
  /** 表格加载 */
  const loadingRef = ref<boolean>(!!props.loading);
  /** 宽度内部缓存 */
  const innerWidthMap = new Map<Key, number>();
  /**拖拽起始行 */
  const sourceRecord = ref<Partial<any>>({});
  /**拖拽目标行 */
  const targetRecord = ref<Partial<any>>({});
  /**拖拽起始索引 */
  let oldIndex: number | null = null;
  /**拖拽目标索引 */
  let newIndex: number | null = null;

  if (!Object.is(props.pagination, false)) {
    paginationRef.value = {
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ['10', '20', '50', '100'],
      showQuickJumper: true,
      showSizeChanger: true, // 显示可改变每页数量
      showTotal: total => `${t('共')} ${total} ${t('条')}`, // 显示总数
      ...props.pagination,
    };
  }
  /**
   * @description 获取props
   */
  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) };
  });

  const selectedRowKeys = ref<any[]>(props?.rowSelection?.selectedRowKeys ?? []);
  const getBindValues = computed(() => {
    const props = unref(getProps);
    let propsData: Recordable = {
      ...props,
      rowKey: props.rowKey ?? 'id',
      loading: props.loading ?? unref(loadingRef),
      pagination: unref(paginationRef),
      tableLayout: props.tableLayout ?? 'fixed',
      scroll: unref(scroll),
      ...((props.isSelect || props.isMultipleSelect) && {
        rowSelection: {
          type: props.isSelect ? 'radio' : 'checkbox',
          columnWidth: 0,
          hideSelectAll: true,
          selectedRowKeys: props?.rowSelection?.selectedRowKeys ?? selectedRowKeys.value,
          onChange: (keys: any[]) => {
            selectedRowKeys.value = keys;
          },
        },
      }),
      customRow: (record: any, index: number) => {
        let rowEvent: any = null;
        return {
          onClick: () => {
            if (props.isMultipleSelect) {
              // @ts-ignore
              const curKey = record[props.rowKey ?? 'id'];
              // 判断是否已经选中
              const index = selectedRowKeys.value.findIndex(item => item === curKey);
              if (index > -1) {
                selectedRowKeys.value.splice(index, 1);
              } else {
                selectedRowKeys.value.push(curKey);
              }
              emit('handleClickRow', record, curKey, selectedRowKeys.value);
            } else if (props.isSelect) {
              // @ts-ignore
              const curKey = record[props.rowKey ?? 'id'];
              selectedRowKeys.value = [curKey];
              emit('handleClickRow', record, curKey, selectedRowKeys.value);
            }
          },
          ...(props.dragSort && {
            style: {
              cursor: 'pointer',
            },
            // 鼠标移入
            onMouseenter: (event: MouseEvent) => {
              // 兼容IE
              const ev = event || window.event;
              rowEvent = ev.target as HTMLElement;
              // target.draggable = true;
            },
            // 鼠标移动
            onMousemove: (event: MouseEvent) => {
              // 判断鼠标是否在拖拽元素,及其子元素上
              const target = event.target as HTMLElement;
              const dragIcon = rowEvent?.getElementsByClassName('table-drag-icon')?.[0];
              if (dragIcon && (dragIcon === target || dragIcon.contains(target))) {
                rowEvent.draggable = true;
              } else {
                rowEvent && (rowEvent.draggable = false);
              }
            },
            // 开始拖拽
            onDragstart: (event: Event) => {
              // 兼容IE
              const ev = event || window.event;
              ev.stopPropagation();
              // 得到源目标数据
              sourceRecord.value = record;
              oldIndex = index;
            },
            // 拖动元素经过的元素
            onDragover: (event: DragEvent) => {
              // 兼容 IE
              const ev = event || window.event;
              // 阻止默认行为
              ev.preventDefault();
              ev.dataTransfer!.dropEffect = 'move'; // 可以去掉拖动时那个＋号
              const list = document.getElementsByClassName(provideConfig.clsPrefixRef.value + '-table-row');
              const node = document.getElementsByClassName('drag-target');
              if (node.length) {
                node[0].classList.remove('drag-target');
              }
              list[index].classList.add('drag-target');
              newIndex = index;
            },
            // 鼠标松开
            onDrop: (event: Event) => {
              // 兼容IE
              const ev = event || window.event;
              // 恢复鼠标状态
              // 阻止冒泡
              ev.stopPropagation();
              // 得到目标数据
              targetRecord.value = record;
              // 将源数据插入目标数据前面
              newIndex = index;

              if (newIndex === oldIndex) return;
              tableData.value.splice(oldIndex!, 1);
              tableData.value.splice(newIndex, 0, sourceRecord.value);
              emit('tableSortChange', tableData.value);
              const node = document.getElementsByClassName('drag-target');
              if (node.length) {
                node[0].classList.remove('drag-target');
              }
            },
          }),
        };
      },
    };
    // if (slots.expandedRowRender) {
    //   propsData = omit(propsData, ['scroll']);
    // }

    propsData = omit(propsData, ['class', 'onChange', 'columns']);
    return propsData;
  });

  // 如果外界设置了dataSource，那就直接用外界提供的数据
  watch(
    () => props.dataSource,
    val => {
      if (val) {
        tableData.value = val;
        // 如果有分页， 则更新分页
        if (paginationRef.value) {
          // 如果在最后一个页码删除了所有数据，自动往前一页查询
          if (
            paginationRef.value.current &&
            paginationRef.value.current > 1 &&
            paginationRef.value.pageSize &&
            (paginationRef.value.current - 1) * paginationRef.value.pageSize >= val.length
          ) {
            paginationRef.value = {
              ...paginationRef.value,
              total: val.length,
              current: paginationRef.value.current - 1,
            };
          } else {
            paginationRef.value = {
              ...paginationRef.value,
              total: val.length,
            };
          }
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  watch(
    () => props.columns,
    val => {
      if (val) {
        innerPropsRef.value = {
          ...innerPropsRef.value,
          columns: val,
        };
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  return {
    tableRef,
    loadingRef,
    tableData,
    queryFormRef,
    sortParamsRef,
    innerPropsRef,
    getProps,
    getBindValues,
    paginationRef,
    headerSearchInputRef,
    headerSearchDataRef,
    innerWidthMap,
    tableKey,
  };
};
