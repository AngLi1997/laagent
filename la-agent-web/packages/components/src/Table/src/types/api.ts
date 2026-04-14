/** 全局通过表格查询返回结果 */
export interface TableListResult<T = any> {
  code: number;
  data: {
    data?: T;
    page_num: number;
    page_size?: number;
    total?: number;
    total_page?: number;
  };
  message: string;
}

/** 全局通用表格分页返回数据结构 */
export interface PaginationResult {
  page_num: number;
  page_size: number;
  total: number;
}

/** 全局通用表格分页请求参数 */
export type PageParams<T = any> = {
  limit?: number;
  page?: number;
} & {
  [P in keyof T]?: T[P];
};

export interface ErrorResponse {
  /** 业务约定的错误码 */
  errorCode: string;
  /** 业务上的错误信息 */
  errorMessage?: string;
  /** 业务上的请求是否成功 */
  success?: boolean;
}
