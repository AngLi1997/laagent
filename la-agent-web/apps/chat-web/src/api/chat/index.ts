import request from '@/services';
import { getStoredToken } from '@/utils/token';

const baseUrl = window?.$wujie?.props?.apiBase || '/api/app';

/**
 * @description: 赞踩(管理员) /api/app/agent/conversation/tag/admin_tag
 * @param data
 */
export const adminTag = (data: any) => {
  return request({
    url: '/agent/conversation/tag/admin_tag',
    method: 'PUT',
    data,
  });
};

/**
 * @description: 赞踩(用户) /api/app/agent/conversation/tag/tag
 * @param data
 */
export const userTag = (data: any) => {
  return request({
    url: '/agent/conversation/tag/tag',
    method: 'PUT',
    data,
  });
};

/**
 * @description: 智能体对话 /api/app/agent/chat/sse/generate
 */
export const AgentChat = async (formData: FormData, signal?: AbortSignal) => {
  const res = await fetch(`${baseUrl}/agent/chat/sse/generate`, {
    method: 'POST',
    headers: {
      'Accept': 'text/event-stream',
      'BMOS-ACCESS-TOKEN': getStoredToken(),
    },
    body: formData,
    signal,
  });
  if (res.status === 401 || res.status === 403) { // 401的话清空token，并刷新页面
    localStorage.removeItem('BMOS-ACCESS-TOKEN');
    window.location.reload();
  }
  else if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  // else if (typeof res.body === 'object' && !(res.body instanceof ReadableStream)) {
  //   throw new Error(res.body?.message);
  // }
  // console.log('res', res)
  return res;
};

/**
 * @description: 模型对话 /api/app/agent/chat/sse/test
 */
export const ModelChat = async (data: FormData, signal?: AbortSignal) => {
  const res = await fetch(`${baseUrl}/agent/chat/sse/test`, {
    method: 'POST',
    headers: {
      'Accept': 'text/event-stream',
      'BMOS-ACCESS-TOKEN': getStoredToken(),
    },
    body: data,
    signal,
  });
  if (res.status === 401 || res.status === 403) { // 401的话清空token，并刷新页面
    localStorage.removeItem('BMOS-ACCESS-TOKEN');
    window.location.reload();
  }
  else if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  return res;
};

/**
 * @description: 获取智能体列表 /api/app/agent/agents/list
 * @param {any} params
 */
export const getAgents = (params: any = {}) => {
  return request({
    url: '/agent/agents/list',
    method: 'GET',
    params,
  });
};

/**
 * @description: 分页查询当前登录人的对话历史记录 /api/app/agent/conversation/page
 * @param {any} params
 */
export const getConversationPage = (params: any) => {
  return request({
    url: '/agent/conversation/page',
    method: 'GET',
    params,
  });
};

/**
 * @description: 获取对话历史详情 /api/app/agent/conversation/get_info
 * @param {any} params
 */
export const getConversationInfo = (params: any) => {
  return request({
    url: '/agent/conversation/get_info',
    method: 'GET',
    params,
  });
};

/**
 * @description: 更新对话标题 /api/app/agent/conversation/edit_title
 * @param {any} data
 */
export const updateConversationTitle = (data: any) => {
  return request({
    url: '/agent/conversation/edit_title',
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除对话 /api/app/agent/conversation/clear
 * @param {any} params
 */
export const deleteConversation = (params: any) => {
  return request({
    url: '/agent/conversation/clear',
    method: 'DELETE',
    params,
  });
};

/**
 * @description: 删除全部对话 /api/app/agent/conversation/clear_all
 */
export const deleteAllConversation = () => {
  return request({
    url: '/agent/conversation/clear_all',
    method: 'DELETE',
  });
};

/**
 * @description: 获取当前用户最近使用的智能体 /api/app/agent/conversation/get_last_agent
 */
export const getLastUseAgent = () => {
  return request({
    url: '/agent/conversation/get_last_agent',
    method: 'GET',
  });
};

/**
 * @description: 新增用户反馈(用户) /api/app/agent/feedback/create_feedback
 * @param {any} data
 */
export const createFeedback = (data: any) => {
  return request({
    url: '/agent/feedback/create_feedback',
    method: 'POST',
    data,
  });
};

/**
 * @description: 查看反馈记录(用户) /api/app/agent/feedback/list_feedback_history
 */
export const getFeedbackHistory = () => {
  return request({
    url: '/agent/feedback/list_feedback_history',
    method: 'POST',
  });
};
