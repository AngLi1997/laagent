import type { Cell } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import { FlowNodeEnum, PortIdEnum } from '@/components/Flow/type';

/**
 * @description: 过滤空值
 * @param obj  对象
 * @returns  过滤后的对象
 */
export const filterEmpty = (obj: any) => {
  return Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
};

/**
 * @description: 获取流出节点 id 数组
 * @param cell 节点
 * @param edges 边集合
 * @returns 流出节点 id 数组
 */
export const getCellOutgoing = (cell: Cell.Properties, edges: Cell.Properties) => {
  const result: string[] = [];

  if (cell.shape === FlowNodeEnum.EDGE) {
    result.push(cell.target.cell);
  }
  else {
    const items = edges.filter((item: Cell.Properties) => item.source.cell === cell.id);
    items.forEach((item: Cell.Properties) => {
      result.push(item.id as string);
    });
  }
  return result;
};

/**
 * @description: 获取流入节点 id 数组
 * @param cell 节点
 * @param edges 边集合
 * @returns 流入节点 id 数组
 */
export const getCellIncoming = (cell: Cell.Properties, edges: Cell.Properties) => {
  const result: string[] = [];
  if (cell.shape === FlowNodeEnum.EDGE) {
    result.push(cell.source.cell);
  }
  else {
    const items = edges.filter((item: Cell.Properties) => item.target.cell === cell.id);
    items.forEach((item: Cell.Properties) => {
      result.push(item.id as string);
    });
  }
  return result;
};

/**
 * @description: 获取 node_config
 * @param cell 节点
 * @returns Object
 */
const getNodeConfig = (cell: Cell.Properties) => {
  return cell.data?.formData?.[`${cell.shape}_config`] ?? {};
};

export const getNodeName = (cell: Cell.Properties) => {
  if (cell.shape === FlowNodeEnum.START || cell.shape === FlowNodeEnum.END) {
    return cell.data?.label;
  }
  return cell.data?.formData?.node_name || cell.shape;
};
/**
 * @description: 处理流程图数据
 * @param {any} data 流程图数据
 * @param nodes 模态框数据
 * @returns 处理后的流程图数据
 */
export const handelNodeData = (data: { cells: Cell.Properties[] }, nodes?: Recordable) => {
  const result: any = [];
  const { cells } = data;
  const items = cells.filter(item => item.shape !== FlowNodeEnum.EDGE);
  items.forEach((item) => {
    result.push({
      ...(nodes
        && nodes.length && {
        ...nodes.find((i: any) => i.node_id === item.id),
      }),
      node_id: item.id,
      node_name: getNodeName(item),
      node_type: item.shape,
      inputs: item.data?.formData?.inputs || [],
      outputs: item.data?.formData?.outputs || [],
      output_to_user: item.data?.formData?.output_to_user || false,
      error_handle: item.data?.formData?.error_handle || {},
      node_config: getNodeConfig(item),
      styles: JSON.stringify(item),
    });
  });
  return result;
};

/**
 * @description: 处理流程图 formData 回显
 * @param {any} item 后端返回的 数据项
 * @returns 处理后的流程图formData数据
 */
export const getNodeFormData = (item: any) => {
  try {
    return {
      node_name: item.node_name,
      node_type: item.node_type,
      inputs: item.inputs,
      outputs: item.outputs,
      output_to_user: item.output_to_user,
      error_handle: item.error_handle,
      [`${item.node_type}_config`]: item.node_config,
    };
  }
  catch (_error) {
    return {};
  }
};

/**
 * @description: 获取 from_case
 * @param {Cell.Properties} edge 边数据
 * @param {Cell.Properties[]} cells 节点集合
 * @returns {string} from_case
 */
const getFromCase = (edge: Cell.Properties, cells: Cell.Properties[]): string => {
  let result: string = '';
  const source = cells.find((item: Cell.Properties) => item.id === edge.source.cell);
  const cases = source?.data?.formData?.[`${FlowNodeEnum.CONDITION}_config`]?.cases || [];
  switch (edge.source.port) {
    case PortIdEnum.CONDITION_RIGHT_IF:
      result = cases[0]?.key || '';
      break;
    case PortIdEnum.CONDITION_RIGHT_ELSE:
      result = cases[cases.length - 1]?.key || '';
      break;
    default:
      // port condition-right-else-if-port_1 取 cases[1]
      result = cases[edge.source.port.split('_')[1]]?.key || '';
      break;
  }
  return result;
};

export const getNameById = (id: string, nodes: Cell.Properties[]) => {
  const node = nodes.find((item: Cell.Properties) => item.id === id);
  if (node?.shape === FlowNodeEnum.START || node?.shape === FlowNodeEnum.END) {
    return node?.data?.label;
  }
  return node?.data?.formData?.node_name || node?.data?.label;
};

/**
 * @description: 处理边数据
 * @param {any} data 处理边数据
 * @returns 处理边数据
 */
export const handelEdgeData = (data: { cells: Cell.Properties[] }) => {
  const result: any = [];
  const { cells } = data;
  const edges = cells.filter(item => item.shape === FlowNodeEnum.EDGE);
  edges.forEach((item) => {
    result.push({
      id: item.id,
      to_node: getNameById(item.target.cell, cells),
      from_node: getNameById(item.source.cell, cells),
      ...(item.source.port?.includes('condition-right') && { from_case: getFromCase(item, cells) }),
      styles: JSON.stringify(item),
    });
  });
  return result;
};
