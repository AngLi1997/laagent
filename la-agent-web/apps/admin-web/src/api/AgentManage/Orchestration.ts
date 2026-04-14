import request from '@/services';

/**
 * @description: 新增分类 /agent/agents/category/create
 * @param {any} data
 */

export const reqAgentCategoryCreate = (data: any) => {
  return request({
    url: `/agent/agents/category/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 查询分类 /agent/agents/category/tree
 */

export const reqAgentCategoryTree = () => {
  return request({
    url: `/agent/agents/category/tree`,
    method: 'GET',
  });
};

/**
 * @description: 分页 /agent/agents/page
 */

export const reqAgentsPage = (data: any) => {
  return request({
    url: `/agent/agents/page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 编辑 /agent/agents/category/update
 */

export const reqAgentsCategoryUpdate = (data: any) => {
  return request({
    url: `/agent/agents/category/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除分类 /agent/agents/category/remove
 */

export const reqAgentsCategoryRemove = (id: any) => {
  return request({
    url: `/agent/agents/category/remove?id=${id}`,
    method: 'DELETE',
  });
};

/**
 * @description: 删除 /agent/agents/remove
 */

export const reqAgentsRemove = (id: any) => {
  return request({
    url: `/agent/agents/remove`,
    method: 'DELETE',
    data: {
      id,
    },
  });
};

/**
 * @description: 新增 /agent/agents/create
 */

export const reqAgentsCreate = (data: any) => {
  return request({
    url: `/agent/agents/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 编辑 /agent/agents/update
 */

export const reqAgentsUpdate = (data: any) => {
  return request({
    url: `/agent/agents/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 启停 /agent/agents/status
 */

export const reqAgentsStatus = (data: any) => {
  return request({
    url: `/agent/agents/status`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 大模型下拉 /agent/agents/llm/list
 */

export const reqAgentAgentsLLMList = () => {
  return request({
    url: `/agent/agents/llm/list`,
    method: 'GET',
  });
};

/**
 * @description: 知识库下拉 /agent/agents/kb/list
 */

export const reqAgentAgentsKBList = () => {
  return request({
    url: `/agent/agents/kb/list`,
    method: 'GET',
  });
};

/**
 * @description: 工具下拉 agents/tool/list
 */
export const reqAgentAgentsToolList = () => {
  return request({
    url: `/agent/agents/tool/list`,
    method: 'GET',
  });
};

/**
 * @description: 获取智能体 /api/app/agent/agents/list
 * @param {string} id
 */
export const getAgent = (id?: string) => {
  return request({
    url: '/agent/agents/list',
    method: 'GET',
    params: { ...(id ? { id } : {}) },
  });
};
