
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


/**
 * @description: 会话类型
 * @enum {string} conversation-会话
 * @enum {string} detail-详情
 */
export enum ConversationType {
  conversation = 'conversation',
  detail = 'detail',
}

/**
 * @description: 消息状态
 * @enum {string} loading-加载中
 * @enum {string} local-本地消息
 * @enum {string} error-错误消息
 * @enum {string} success-成功消息
 */
export enum MessageStatusEnum {
  loading = 'loading',
  local = 'local',
  error = 'error',
  success = 'success',
}

/**
 * @description: 聊天框props
 * @prop {string} conversationId 对话id
 * @prop {ConversationType} type 类型 (对话 | 详情)
 * @prop {boolean} canLike 是否能够点赞
 */
export interface Props {
  /**
   * 智能体id
   */
  agentId?: string;
  /**
   * 模型id
   */
  modelId?: string;
  /**
   * 对话id
   */
  conversationId?: string;
  /**
   * 类型 (对话 | 详情)
   * @default 'conversation'
   */
  type?: ConversationType;
  /**
   * 是否能够点赞/踩
   * @default true
   */
  canLike?: boolean;
};

/**
 * @description: 消息类型
 * @prop {string} input 消息内容
 * @prop {string} conversation_id 会话id
 * @prop {string} agent_id 智能体id
 * @prop {boolean} search_on_line 是否联网
 */
export interface Message {
  /**
   * 消息内容
   */
  input: string;
  /**
   * 是否联网
   */
  search_on_line: boolean;
  /**
   * 会话id
   */
  conversation_id?: string;
  /**
   * 智能体id
   */
  agent_id?: string;

};

/**
 * @description: 操作key
 * @enum {string} delete-删除
 * @enum {string} edit-编辑
 */
export enum DropdownKeys {
  delete = 'delete',
  edit = 'edit',
};

/**
 * @description: 消息类型
 *
 * @enum {string} start-开始
 * @enum {string} searchOnline-搜索结果
 * @enum {string} text-文本
 * @enum {string} toolCalling-工具调用
 * @enum {string} toolResult-工具结果
 * @enum {string} documentLink-文档链接
 * @enum {string} recommendedQuestion-推荐问题
 * @enum {string} error-错误
 * @enum {string} end-结束
 */
export enum MessageType {
  user = 'user',
  start = 'start',
  searchOnline = 'search_online_result',
  text = 'text',
  toolCalling = 'tool_calling',
  toolResult = 'tool_result',
  documentLink = 'document_link',
  recommendedQuestion = 'recommended_question',
  error = 'error',
  end = 'end',
};

/**
 * @description: 工具调用结果枚举
 */
export enum ToolResultEnum {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

/**
 * @description: 工具调用/结果消息体
 * @prop {string} tool_id 工具id
 * @prop {string} tool_name 工具名称
 * @prop {any} tool_param 工具参数
 * @prop {any} result 工具结果
 * @prop {ToolResultEnum} status 工具调用状态
 * @prop {string} error_msg 错误信息
 */
export interface ToolCallingMessage {
  /**
   * 工具id
   */
  tool_id: string;
  /**
   * 工具名称
   */
  tool_name: string;
  /**
   * 工具参数
   */
  tool_param: any;
  /**
   * 工具结果
   */
  result?: any;
  /**
   * 工具调用状态
   */
  status?: ToolResultEnum;
  /**
   * 错误信息
   */
  error_msg?: string;
}

/**
 * @description: 文档链接消息体
 * @prop {string} knowledge_base_id 知识库id
 * @prop {string} knowledge_base_name 知识库名称
 * @prop {string} document_id 文档id
 * @prop {string} document_name 文档名称
 * @prop {string} document_url 文档链接
 * @prop {string} document_chunk_id 文档片段id
 * @prop {string} document_chunk_content 文档内容
 */
export interface DocumentLinkMessage {
  /**
   * 知识库id
   */
  knowledge_base_id: string;
  /**
   * 知识库名称
   */
  knowledge_base_name: string;
  /**
   * 文档id
   */
  document_id: string;
  /**
   * 文档名称
   */
  document_name: string;
  /**
   * 文档链接
   */
  document_url: string;
  /**
   * 文档片段id
   */
  document_chunk_id: string;
  /**
   * 文档内容
   */
  document_chunk_content: string;
}

/**
 * @description: 联网搜索结果消息体
 * @prop {string} engine 搜索引擎
 * @prop {string} title 网站名称
 * @prop {string} result 网站内容
 * @prop {string} url url
 */
export interface SearchOnlineMessage {
  /**
   * 搜索引擎
   */
  engine: string;
  /**
   * 网站名称
   */
  title: string;
  /**
   * 网站内容
   */
  result: string;
  /**
   * url
   */
  url: string;
};

/**
 * @description: 基础消息体类型
 * @prop {string} conversation_id 会话id
 * @prop {string} message_type 消息类型
 * @prop {string} input 用户输入的问题
 * @prop {string} content 回复内容
 * @prop {number} during 耗时
 * @prop {FeedbackType} liked 点赞/踩
 * @prop {Map<string, ToolCallingMessage>} tools 工具列表
 * @prop {Map<string, DocumentLinkMessage>} docs 文档列表
 * @prop {Map<string, SearchOnlineMessage>} search_online_result 联网搜索网站列表
 * @prop {boolean} search_on_line 是否联网
 * @prop {string} agent_id 智能体id
 * @prop {string} question_id 问题id
 * @prop {string} answer_id 回答id
 */
export interface BaseMessage {
  /**
   * 智能体id
   */
  agent_id?: string;
  /**
   * 模型id
   */
  model_id?: string;
  /**
   * 会话id
   */
  conversation_id?: string;
  /**
   * 问题id
   */
  question_id?: string;
  /**
   * 回答id
   */
  answer_id?: string;
  /**
   * 消息类型
   */
  message_type: MessageType;
  /**
   * 用户输入的问题
   */
  input?: string;
  /**
   * 回复内容
   */
  content?: string;
  /**
   * 耗时
   */
  during?: number;
  /**
   * 点赞/踩
   */
  liked?: FeedbackType | null;
  /**
   * 工具列表
   */
  tools?: Map<string, ToolCallingMessage>;
  /**
   * 文档列表
   */
  docs?: Map<string, DocumentLinkMessage[]>;
  /**
   * 联网搜索网站列表
   */
  search_online_result?: Map<string, SearchOnlineMessage>;
  /**
   * 文件列表
   */
  input_files?: any[];
  /**
   * node_id
   */
  node_id?: string;
}

/**
 * @description: 问题推荐消息体
 * @prop {Array<string>} questions 推荐问题
 * @prop {string} message_type 消息类型
 * @prop {string} conversation_id 会话id
 * @prop {string} input 用户输入的问题
 * @prop {string} content 回复内容
 * @prop {number} during 耗时
 */
export interface RecommendedQuestionMessage extends BaseMessage {
  /**
   * 推荐问题
   */
  questions: Array<string>;
}

/**
 * @description: 错误消息体
 * @prop {string} error 错误信息
 * @prop {string} message_type 消息类型
 * @prop {string} conversation_id 会话id
 * @prop {string} input 用户输入的问题
 * @prop {number} during 耗时
 */
export interface ErrorMessage extends BaseMessage {
  /**
   * 错误信息
   */
  error: string;
}

export type MessageInfoType = BaseMessage & (
  Partial<SearchOnlineMessage> &
  Partial<DocumentLinkMessage> &
  Partial<ToolCallingMessage> &
  Partial<RecommendedQuestionMessage> &
  Partial<ErrorMessage>
);
