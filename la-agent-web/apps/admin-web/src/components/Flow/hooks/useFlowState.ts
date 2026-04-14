import type { Graph, Options } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import type { SetupContext } from 'vue';
import type { FlowProps } from '../type';
import { Shape } from '@antv/x6';
import { t } from '@bmos/i18n';
import { computed, ref, watch } from 'vue';
import { PortIdEnum } from '../type';

export type FlowState = ReturnType<typeof useFlowState>;

export interface useFlowStateParams {
  props: FlowProps;
  attrs: SetupContext['attrs'];
}

export const useFlowState = ({ props, attrs }: useFlowStateParams) => {
  const leftToolRef = ref<any>(null);
  const dnd = ref<any>(null);

  const getFlowProps = computed(() => {
    return {
      ...attrs,
      ...props,
    } as FlowProps;
  });

  // 基础 画布 配置
  const defaultGraphConfig = ref<Partial<Graph.Options>>({
    autoResize: true,
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
      args: [
        {
          color: '#E9EAED',
          thickness: 2,
        },
        {
          color: '#E9EAED',
          thickness: 2,
        },
      ],
    },
    background: {
      color: '#F5F6F7',
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowMulti: true,
      allowLoop: false,
      highlight: true,
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      connectionPoint: 'anchor',
      router: {
        name: 'manhattan',
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#999999',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      validateConnection(
        this: Graph,
        { sourceView, targetView, sourceMagnet, targetMagnet }: Options.ValidateConnectionArgs,
      ) {
        // 只能从输出链接桩创建连接桩
        if (!sourceMagnet) {
          return false;
        }
        // 只能连接到输入链接桩
        if (!targetMagnet) {
          return false;
        }
        // 判断是否为同一个节点
        if (sourceView === targetView) {
          return false;
        }
        // 判断目标链接桩是否开始节点
        if (targetMagnet.getAttribute('port')?.includes('start')) {
          return false;
        }
        if (sourceMagnet.getAttribute('port')?.includes('end')) {
          return false;
        }

        // 条件节点的左侧端口不能连接到其他节点
        if (sourceMagnet.getAttribute('port') === PortIdEnum.CONDITION_LEFT) {
          return false;
        }
        // 条件节点的右侧端口只能连接到其他节点
        if (targetMagnet.getAttribute('port') !== PortIdEnum.CONDITION_LEFT && targetMagnet.getAttribute('port')?.includes('condition')) {
          return false;
        }
        // // 条件节点的右侧端口只能连接到其他节点一次
        // if (sourceMagnet.getAttribute('port')?.includes('condition-right')) {
        //   if (sourceCell) {
        //     const sourceEdges = this.getOutgoingEdges(sourceCell.id) || [];
        //     // 遍历 sourceEdges 这个数组中 sourceEdge的 source 字段的 port 属性值 有和 sourceEdges 的其他一样的值
        //     // [{source: {port: 'condition-right-if-port'}}, {source: {port: 'condition-right-if-port'}}] 这样两个 port 一样 返回false
        //     // @ts-expect-error
        //     const hasDuplicatePorts = sourceEdges.filter(edge => edge.source.port === sourceMagnet.getAttribute('port'))?.length;
        //     if (hasDuplicatePorts > 1) {
        //       return false;
        //     }
        //   }
        // }

        // let isValid = true;
        // if (
        //   targetCell
        //   && (targetCell.shape === FlowNodeEnum.LLM
        //     || targetCell.shape === FlowNodeEnum.TOOL
        //     || targetCell.shape === FlowNodeEnum.KNOWLEDGE_BASE
        //     || targetCell.shape === FlowNodeEnum.USER_INPUT
        //   )
        // ) {
        //   isValid = (this.getIncomingEdges(targetCell.id) || []).length < 1;
        // }
        // if (
        //   sourceCell
        //   && (
        //     sourceCell.shape === FlowNodeEnum.START
        //     || sourceCell.shape === FlowNodeEnum.LLM
        //     || sourceCell.shape === FlowNodeEnum.TOOL
        //     || sourceCell.shape === FlowNodeEnum.KNOWLEDGE_BASE
        //     || sourceCell.shape === FlowNodeEnum.USER_INPUT
        //   )
        // ) {
        //   isValid = (this.getOutgoingEdges(sourceCell.id) || []).length < 2;
        // }
        // return isValid;
        return true;
      },
    },
    highlighting: {
      magnetAvailable: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#47C769',
          },
        },
      },
    },
    panning: true,
    mousewheel: {
      enabled: true,
      minScale: 0.2,
      maxScale: 4,
    },
    translating: {
      restrict: true,
    },
  });

  // 基础 port 配置
  const defaultPortConfig = ref({
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#108ee9',
            strokeWidth: 1,
            fill: 'transparent',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#108ee9',
            strokeWidth: 1,
            fill: 'transparent',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#108ee9',
            strokeWidth: 1,
            fill: 'transparent',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#108ee9',
            strokeWidth: 1,
            fill: 'transparent',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'top',
      },
      {
        id: 'port2',
        group: 'right',
      },
      {
        id: 'port3',
        group: 'bottom',
      },
      {
        id: 'port4',
        group: 'left',
      },
    ],
  });

  // 基础 node 配置
  const defaultNodeConfig = ref({
    shape: 'custom-vue-node',
    x: 100,
    y: 60,
    width: 206,
    height: 44,
    ports: defaultPortConfig.value,
    data: {
      label: t('工序节点'),
    },
  });

  // 监听 modalJson 的变化
  const fromJSON = ref<any>(null);
  const isView = computed(() => props.isView);
  watch(
    () => props.modalJson,
    (newVal) => {
      if (newVal && newVal.length > 0) {
        fromJSON.value = newVal;
      }
    },
    { immediate: true, deep: true },
  );

  // 环境变量
  const envs = ref<Recordable[]>(props.envs || []);

  return {
    getFlowProps,
    defaultGraphConfig,
    defaultPortConfig,
    defaultNodeConfig,
    fromJSON,
    isView,
    leftToolRef,
    dnd,
    envs,
  };
};
