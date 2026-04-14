import type { Cell, Edge, Graph, Node } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import type { Ref } from 'vue';
import type { FlowEmitFn, FlowNodeEnumType } from '../type';
import type { FlowLeftToolBar } from '../type/toolBar';
import type { FlowState } from './useFlowState';
import { t } from '@bmos/i18n';
import { cloneDeep, deepMerge, getUUID, isEmpty } from '@bmos/utils';
import { message } from 'ant-design-vue';
import { FlowNodeEnum, PortDefaultAttr, PortIdEnum } from '../type';

export type FlowMethods = ReturnType<typeof useFlowMethods>;

export type useFlowMethodsParams = FlowState & {
  emit: FlowEmitFn;
  graph: Ref<Graph>;
};

export const useFlowMethods = (flowMethodsContext: useFlowMethodsParams) => {
  const { graph, defaultNodeConfig, defaultPortConfig, emit, dnd } = flowMethodsContext;

  /**
   * @description: 显示端口
   * @param {NodeListOf<HTMLElement>} ports
   * @param {boolean} show
   */
  const showPorts = (ports: NodeListOf<HTMLElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      const port = ports[i];
      port.style.visibility = show ? 'visible' : 'hidden';
    }
  };

  /**
   * @description: 初始化画布
   * @param {(Node.Metadata | Edge.Metadata)[]} cells
   */
  const initGraph = (cells?: (Node.Metadata | Edge.Metadata)[]) => {
    if (cells) {
      graph.value?.fromJSON(cells);
    }
    else {
      graph.value?.fromJSON({
        nodes: [
          {
            ...defaultNodeConfig.value,
            shape: FlowNodeEnum.START,
            width: 120,
            height: 44,
            x: 500,
            y: 60,
            ports: {
              ...defaultPortConfig.value,
              items: [
                {
                  id: PortIdEnum.START_TOP,
                  group: 'top',
                },
                {
                  id: PortIdEnum.START_RIGHT,
                  group: 'right',
                },
                {
                  id: PortIdEnum.START_LEFT,
                  group: 'left',
                },
                {
                  id: PortIdEnum.START_BOTTOM,
                  group: 'bottom',
                },
              ],
            },
            data: {
              label: t('开始'),
            },
          },
          {
            ...defaultNodeConfig.value,
            shape: FlowNodeEnum.END,
            width: 120,
            height: 44,
            x: 500,
            y: 500,
            ports: {
              ...defaultPortConfig.value,
              items: [
                {
                  id: PortIdEnum.END_TOP,
                  group: 'top',
                },
                {
                  id: PortIdEnum.END_RIGHT,
                  group: 'right',
                },
                {
                  id: PortIdEnum.END_LEFT,
                  group: 'left',
                },
                {
                  id: PortIdEnum.END_BOTTOM,
                  group: 'bottom',
                },
              ],
            },
            data: {
              label: t('结束'),
            },
          },
        ],
      });
    }
  };

  /**
   * @description: 拖拽开始
   * @param {DragEvent} e
   */
  const allowDrop = (e: DragEvent) => {
    e.preventDefault();
  };

  /**
   * @description: 拖拽结束 添加节点
   * @param {DragEvent} e
   */
  const dragstartNode = (e: any, item: FlowLeftToolBar) => {
    try {
      if (item) {
        const jsonData = item;
        const shape = jsonData.shape || FlowNodeEnum.LLM;
        const { width, height } = jsonData;
        let node: Node | undefined;
        if (shape === FlowNodeEnum.CONDITION) {
          node = graph.value?.createNode({
            ...defaultNodeConfig.value,
            ports: {
              groups: {
                left: {
                  position: 'left',
                  attrs: PortDefaultAttr,
                },
                ifPort: {
                  position: [260, 69],
                  attrs: PortDefaultAttr,
                },
                elsePort: {
                  position: [260, 95],
                  attrs: PortDefaultAttr,
                },
                elseIfPort: {
                  position: [260, 95],
                  attrs: PortDefaultAttr,
                },
              },
              items: [
                {
                  id: PortIdEnum.CONDITION_LEFT,
                  group: 'left',
                },
                {
                  id: PortIdEnum.CONDITION_RIGHT_IF,
                  group: 'ifPort',
                },
                {
                  id: PortIdEnum.CONDITION_RIGHT_ELSE,
                  group: 'elsePort',
                },
              ],
            },
            shape,
            width: width || 260,
            height: height || 120,
            data: {
              ...jsonData,
            },
          });
        }
        else {
          node = graph.value?.createNode({
            ...defaultNodeConfig.value,
            shape,
            width: width || 260,
            height: height || 52,
            data: {
              ...jsonData,
            },
          });
        }
        dnd.value.start(node, e);
      }
    }
    catch (_error) {
      message.error(t('添加节点失败'));
    }
  };

  /**
   * @description: 重做
   */
  const undo = () => {
    graph.value?.canUndo() && graph.value?.undo();
  };

  /**
   * @description: 撤销
   */
  const redo = () => {
    graph.value?.canRedo() && graph.value?.redo();
  };

  /**
   * @description: 初始大小
   */
  const reset = () => {
    graph.value?.zoomTo(1);
    // 居中
    graph.value?.centerContent();
  };

  /**
   * @description: 放大 0.2
   */
  const zoomIn = () => {
    graph.value?.zoom(0.2);
  };

  /**
   * @description: 缩小 0.2
   */
  const zoomOut = () => {
    graph.value?.zoom(-0.2);
  };

  /**
   * @description: 根据 id 框选节点
   * @param {string} id 节点 id
   */
  const selectNodeById = (id: string) => {
    const cell = graph.value?.getCellById(id);
    if (cell) {
      graph.value?.resetSelection(cell);
    }
  };

  /**
   * @description: 删除选中节点
   */
  const deleteNode = () => {
    if (isNotStartOrEndCell(graph.value?.getSelectedCells())) {
      graph.value?.removeCells(graph.value?.getSelectedCells());
    }
    else {
      message.warning(t('开始或结束节点不能删除'));
    }
  };

  /**
   * @description: 是否为自定义节点
   * @param {Cell.Cell[]} cells
   * @return {boolean} true: 是自定义节点 false: 不是自定义节点
   */
  const isCustomNode = (cells: Cell<Cell.Properties>[]) => {
    if (
      cells.length
      && cells[0].isNode()
      && cells[0].shape !== FlowNodeEnum.START
      && cells[0].shape !== FlowNodeEnum.END
    ) {
      return true;
    }
    else {
      return false;
    }
  };

  /**
   * @description: 是否为自定义节点
   * @param {Cell.Cell[]} cells
   * @return {boolean} true: 不是开始或结束节点 false: 是开始或结束节点
   */
  const isNotStartOrEndCell = (cells: Cell<Cell.Properties>[]) => {
    if (cells.length && cells[0].shape !== FlowNodeEnum.START && cells[0].shape !== FlowNodeEnum.END) {
      return true;
    }
    else {
      return false;
    }
  };

  /**
   * @description: 获取画布数据
   * @return {Graph.GraphData} 画布数据
   */
  const getFlowData = () => {
    try {
      const data = graph.value.toJSON();
      return data;
    }
    catch (_error) {
      return {};
    }
  };

  /**
   * @description: 点击设置
   * @param {Cell} cell 节点
   */
  const handleClickSet = (cell: Cell, shape: FlowNodeEnumType) => {
    emit('handleClickSet', cell, shape);
  };

  /**
   * @description: 点击下一步
   * @param {Cell} cell 节点
   */
  const handleClickTest = (cell: Cell, shape: FlowNodeEnumType) => {
    emit('handleClickTest', cell, shape);
  };

  /**
   * @description: 根据 id 获取节点 cellData
   * @param {string} settingNodeId 节点 id
   * @return {Recordable} 节点数据
   */
  const getCellDataById = (settingNodeId: string) => {
    const cell = graph.value?.getCellById(settingNodeId);
    return cell?.getData();
  };

  /**
   * @description: 更新节点表单数据
   * @param {string} settingNodeId 节点 id
   * @param {Recordable} formValue 表单数据
   */
  const updateCellData = (settingNodeId: string, formValue: Recordable, key = 'formData') => {
    emit('flowDataChange');
    const cell = graph.value?.getCellById(settingNodeId);
    const cellData = cell?.getData();
    const obj: Recordable = cloneDeep(cellData);
    obj[key] = deepMerge(isEmpty(cellData[key]) ? {} : cellData[key], cloneDeep(formValue) as Recordable);
    if (isEmpty(obj[key].node_name)) {
      formValue.node_name = obj.label;
    }
    cell?.setData(
      {
        ...obj,
        ...(formValue.node_name ? { label: formValue.node_name } : { label: obj.label }),
        ...{ setDataFlag: Date.now() },
      },
      {
        overwrite: true,
        deep: true,
      },
    );
  };

  /**
   * @description: 复制更新id
   * @param {Cell<Cell.Properties>[]} cells 节点
   */
  const handleResetId = (cells: Cell<Cell.Properties>[]) => {
    cells.forEach((cell) => {
      if (cell.isNode()) {
        const newFormData = cloneDeep(cell.data.formData);
        if (newFormData) {
        // cell.data.formData 类似格式， 找出其中的 id 字段, 重新生成一个 id 递归
          const generateNewId = (data: Recordable) => {
            if (data.key) {
              data.key = getUUID();
            }
            Object.keys(data).forEach((key) => {
              if (typeof data[key] === 'object' && data[key] !== null) {
                generateNewId(data[key]);
              }
            });
          };
          generateNewId(newFormData);
          cell.setData({
            ...cell.data,
            formData: newFormData,
          }, {
            overwrite: true,
            deep: true,
          });
        }
      }
    });
  };

  return {
    showPorts,
    allowDrop,
    dragstartNode,
    undo,
    redo,
    reset,
    zoomIn,
    zoomOut,
    deleteNode,
    initGraph,
    isCustomNode,
    isNotStartOrEndCell,
    getFlowData,
    handleClickSet,
    handleClickTest,
    updateCellData,
    selectNodeById,
    getCellDataById,
    handleResetId,
  };
};
