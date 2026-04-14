import type { Cell, Graph } from '@antv/x6';
import type { Ref } from 'vue';
import type { FlowEmitFn, FlowProps } from '../type';
import type { FlowMethods } from './useFlowMethods';
import type { FlowState } from './useFlowState';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { Export } from '@antv/x6-plugin-export';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import { isFunction } from '@bmos/utils';

export type EventListener = ReturnType<typeof useEventListener>;

export type useEventListenerParams = FlowState &
  FlowMethods & {
    props: FlowProps;
    emit: FlowEmitFn;
    graph: Ref<Graph>;
  };

export const useEventListener = (flowEventListenersContext: useEventListenerParams) => {
  const {
    emit,
    showPorts,
    graph,
    isNotStartOrEndCell,
    props,
    isView,
    isCustomNode,
    handleResetId,
  } = flowEventListenersContext;
  const setEventListener = () => {
    // 开启插件功能
    graph.value
      .use(
        new Selection({
          enabled: !isView.value,
        }),
      )
      .use(
        new Snapline({
          enabled: !isView.value,
        }),
      )
      .use(
        new Keyboard({
          enabled: !isView.value,
        }),
      )
      .use(
        new Clipboard({
          enabled: !isView.value,
        }),
      )
      .use(
        new History({
          enabled: !isView.value,
        }),
      )
      .use(new Export());
    if (props.isTransform) {
      graph.value.use(
        new Transform({
          resizing: {
            enabled: (node: Cell) => {
              // 不是开始节点和结束节点
              return isNotStartOrEndCell([node]) || props.notLimitStartOrEndTransform;
            },
            minWidth: 120,
            minHeight: 44,
            maxWidth: 800,
            maxHeight: 500,
            orthogonal: false,
          },
        }),
      );
    }

    /* 快捷键 */
    // 快捷键与事件
    graph.value.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.value.getSelectedCells();
      if (isCustomNode(cells)) {
        graph.value.copy(cells);
      }
      return false;
    });
    graph.value.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.value.getSelectedCells();
      if (isCustomNode(cells)) {
        graph.value.cut(cells);
      }
      return false;
    });
    graph.value.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.value.isClipboardEmpty()) {
        const cells = graph.value.paste({ offset: 60 });
        graph.value.cleanSelection();
        graph.value.select(cells);
        handleResetId(cells);
      }
      return false;
    });
    graph.value.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.value.canUndo()) {
        graph.value.undo();
      }
      return false;
    });
    graph.value.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.value.canRedo()) {
        graph.value.redo();
      }
      return false;
    });
    // graph.value.bindKey(['meta+a', 'ctrl+a'], () => {
    //   const nodes = graph.value.getNodes();
    //   if (nodes) {
    //     graph.value.select(nodes);
    //   }
    // });
    graph.value.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.value.zoom();
      if (zoom < 1.5) {
        graph.value.zoom(0.1);
      }
    });
    graph.value.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.value.zoom();
      if (zoom > 0.5) {
        graph.value.zoom(-0.1);
      }
    });

    /** 删除的一些操作 */
    graph.value.bindKey(['delete', 'backspace'], () => {
      const cells = graph.value.getSelectedCells();
      if (isNotStartOrEndCell(cells)) {
        // 删除当前节点
        graph.value.removeCells(cells);
      }
    });

    // 鼠标移入节点
    const mouseenter = () => {
      const container = document.getElementById('graph-container');
      const ports = container?.querySelectorAll('.x6-port-body');
      !isView.value && showPorts(ports as NodeListOf<HTMLElement>, true);
    };
    graph.value.on(
      'node:mouseenter',
      props.mouseenter && isFunction(props.mouseenter) ? props.mouseenter() : mouseenter,
    );
    // 鼠标移出节点
    graph.value.on('node:mouseleave', () => {
      const container = document.getElementById('graph-container');
      const ports = container?.querySelectorAll('.x6-port-body');
      showPorts(ports as NodeListOf<HTMLElement>, false);
    });
    // 点击 edge 边
    graph.value.on('edge:click', ({ e, edge }) => {
      e.stopPropagation();
      edge.attr('line/stroke', '#5aaaff');
    });

    // 点击节点
    graph.value.on('node:click', ({ e, node }) => {
      e.stopPropagation();
      if (props.isOptionClickNode && node.data?.isAllowClick === false)
        return;
      graph.value?.cleanSelection();
      graph.value?.select(node);
      emit('nodeClick', node);
    });

    // 点击空白处
    graph.value.on('blank:click', ({ e }) => {
      e.stopPropagation();
      graph.value?.cleanSelection();

      // 清除所有边的选中状态
      const edges = graph.value?.getEdges();
      edges?.forEach((edge) => {
        edge.attr('line/stroke', '#999999');
      });
    });

    // 监听所有变化
    graph.value.on('cell:added', ({ cell, options }) => {
      emit('flowDataChange');
      // 如果已经有 cell.data.label 和 graph.value.getNodes() 有相同的 label，则改名 比如 A -> A1
      if (cell?.data?.label) {
        const nodes = graph.value.getNodes().filter(node => node.shape === cell.shape);
        const labels = nodes.map(node => node.data.label);
        if (labels.includes(cell.data.label)) {
          cell.setData({
            ...cell.data,
            label: `${cell.data.title}${labels.length}`,
          });
        }
      }
      // 判断是否是粘贴操作（避免初始加载时也触发）
      if (options?.clipboard) {
        const oldData = cell.getData();
        // 这里你可以自定义逻辑，比如更新某个字段
        cell.setData({
          ...oldData,
        });
      }
    });
    graph.value.on('cell:removed', () => {
      emit('flowDataChange');
    });

    // 监听线是否连接
    graph.value.on('edge:connected', ({ isNew }) => {
      if (isNew) {
        emit('flowDataChange');
      }
    });

    // 监听节点是否移动
    graph.value.on('node:moved', () => {
      emit('flowDataChange');
    });

    // 监听线是否移动
    graph.value.on('edge:moved', () => {
      emit('flowDataChange');
    });

    // 监听节点是否改变大小
    graph.value.on('node:resized', ({ node }) => {
      emit('flowDataChange');
      // 更新 ports 的位置
      const ports = node.getPorts();
      const size = node.size();
      ports.forEach((port) => {
        if (port.id?.includes('condition-right')) {
          node.portProp(port.id, 'args', {
            x: size.width,
          });
        }
      });
    });
    emit('graphRender', graph.value);
  };
  return {
    setEventListener,
  };
};
