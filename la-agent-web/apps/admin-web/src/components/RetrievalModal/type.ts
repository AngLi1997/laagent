/**
 * @description: 检索匹配类型
 * @enum {string} VECTOR 向量检索
 * @enum {string} FUZZY 全文搜索
 *
 */
export enum matchingTypeEnum {
  VECTOR = 'VECTOR',
  FUZZY = 'FUZZY',
}

/**
 * @description: matchParams 检索设置参数
 * @enum {string} matching_type 检索匹配类型
 * @enum {boolean} rerank 是否开启rerank
 * @enum {number} top_k 召回top_k
 * @enum {number} score_threshold 召回阈值
 */
export interface matchParamsType {
  matching_type: matchingTypeEnum;
  rerank: boolean;
  top_k: number;
  score_threshold: number;
};
