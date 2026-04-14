/**
 * 状态
 * @enum {string} Enable 启用
 * @enum {string} Disable 停用
 */
export enum StatusType {
  // 启用
  Enable = 'ENABLE',
  // 停用
  Disable = 'DISABLE',
}

/**
 * 操作类型
 * @enum {string} Add 新增
 * @enum {string} Edit 编辑
 * @enum {string} View 查看
 */
export enum OperationType {
  // 新增
  Add = 'add',
  // 编辑
  Edit = 'edit',
  // 查看
  View = 'view',
}

/**
 * 处理方式
 * @enum {string} STRAIGHT_ANSWER 直接应答
 * @enum {string} FUZZY_COVER 模糊覆盖
 */
export enum HandleType {
  /**
   * @description: 直接应答
   */
  STRAIGHT_ANSWER = 'STRAIGHT_ANSWER',
  /**
   * @description: 模糊覆盖
   */
  FUZZY_COVER = 'FUZZY_COVER',
}