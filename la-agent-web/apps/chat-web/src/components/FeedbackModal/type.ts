/**
 * @description 反馈弹窗类型
 * @enum {string} like-点赞
 * @enum {string} dislike-踩
 */
export enum FeedbackType {
  like = 'LIKE',
  dislike = 'DISLIKE',
}

/**
 * @description 反馈弹窗数据类型
 */
export interface FeedbackModalType {
  index: number;
  type?: FeedbackType;
  id?: string | number | undefined;
  tags?: string[];
  feedback?: string;
};
