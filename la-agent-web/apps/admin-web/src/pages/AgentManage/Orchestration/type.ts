export enum OperationType {
  // 新增
  Add = 'add',
  // 编辑
  Edit = 'edit',
  // 查看
  View = 'view',
}
export interface RightDrawerProps {
  // 节点id
  nodeId: string;
  // 节点表单数据
  nodeFormData: any;
  // 是否查看
  isView: boolean;
  // 流程图数据
  flowDataForDrawer: any[];
  // 节点详情数据
  nodesDetail: any[];
}

// 输入变量类型 string number bool variable_selector input
export enum VariableTypeEnum {
  String = 'string',
  Number = 'number',
  Bool = 'bool',
  VariableSelector = 'variable_selector',
  Input = 'input',
}

// enum 异常处理方式 terminal 终止, continue 继续
export enum ExceptionTypeEnum {
  Terminal = 'terminal',
  Continue = 'continue',
}

// prompts 类型 enum system user
export enum PromptsTypeEnum {
  System = 'system',
  User = 'user',
}

export enum ComparisonOperator {
  contains = 'contains',
  notContains = 'not_contains',
  is = 'is',
  not = 'not',
  isNull = 'is_null',
  notNull = 'not_null',
}
