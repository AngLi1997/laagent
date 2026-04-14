export enum FlowNodeEnum {
  START = 'start',
  END = 'end',
  EDGE = 'edge',
  LLM = 'llm',
  TOOL = 'tool',
  KNOWLEDGE_BASE = 'kb',
  USER_INPUT = 'user-input-node',
  OUTPUT = 'output',
  CONDITION = 'condition',
}
export type FlowNodeEnumType = `${FlowNodeEnum}`;

export const BaseNode = [
  FlowNodeEnum.LLM,
  FlowNodeEnum.TOOL,
  FlowNodeEnum.KNOWLEDGE_BASE,
  FlowNodeEnum.USER_INPUT,
  FlowNodeEnum.CONDITION,
  FlowNodeEnum.OUTPUT,
];

export enum PortIdEnum {
  START_TOP = 'start-top-port',
  START_RIGHT = 'start-right-port',
  START_BOTTOM = 'start-bottom-port',
  START_LEFT = 'start-left-port',

  END_TOP = 'end-top-port',
  END_RIGHT = 'end-right-port',
  END_BOTTOM = 'end-bottom-port',
  END_LEFT = 'end-left-port',

  CONDITION_LEFT = 'condition-left-port',
  CONDITION_RIGHT_IF = 'condition-right-if-port',
  CONDITION_RIGHT_ELSE = 'condition-right-else-port',
  CONDITION_RIGHT_ELSE_IF = 'condition-right-else-if-port',
}

// 环境变量类型 string number bool
export enum EnvTypeEnum {
  STRING = 'string',
  NUMBER = 'number',
  BOOL = 'bool',
}
