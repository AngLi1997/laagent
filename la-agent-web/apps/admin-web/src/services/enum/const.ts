export const LogMenuId = 'Bmos-MenuId';
export const LogOperation = 'Bmos-Operation';
export const LogOperationBusiness = 'Bmos-Operation-Business';
export const ExcludeReq = ['get'];
export const DefaultReq = 'post';
export const DEL_PUT = ['delete', 'put'];
export const EMPTY = '{}';
export const SPLIT = '/';
export const FUNCTION = 'function';

/**
 *  INSERT(0, "新增"),
    UPDATE(1, "编辑"),
    DELETE(2, "删除"),
    EXPORT(3, "导出"),
    RELATE(4, "关联"),
    PROCESS(5, "审核"),
 */
export enum OperationType {
  add,
  edit,
  delete,
  export,
  relevance,
  audit,
}
