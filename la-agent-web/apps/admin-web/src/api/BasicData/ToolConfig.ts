import request from '@/services';

/**
 * @description: 分页 /agent/tools/query
 * @param {any} data
 */

export const reqAgentToolsQuery = (data: any) => {
  return request({
    url: `/agent/tools/query`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 删除 /tools/{tool_id}
 * @param {string} id
 */

export const reqAgentToolRemove = (id: string) => {
  return request({
    url: `/agent/tools/remove`,
    method: 'DELETE',
    data: {
      id,
    },
  });
};

/**
 * @description: 新增 /tools/create
 * @param {any} data
 */

export const reqAgentToolCreate = (data: any) => {
  return request({
    url: `/agent/tools/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 更新 /tools/update
 * @param {any} data
 */

export const reqAgentToolsUpdate = (data: any) => {
  return request({
    url: `/agent/tools/update`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 详情 /tools/find
 * @param {string} id
 */

export const reqAgentToolsFind = (id: string) => {
  return request({
    url: `/agent/tools/find`,
    method: 'GET',
    params: {
      id,
    },
  });
};

/**
 * @description: 测试 /tools/request
 * @param {any} data
 */

export const reqAgentToolRequest = (data: any) => {
  return request({
    url: `/agent/tools/request`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 测试MCP /tools/check/mcpserver
 * @param {any} data
 */

export const reqAgentToolCheckMCPServer = (data: any) => {
  return request({
    url: `/agent/tools/check/mcpserver`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 测试MCP获取工具 /agent/tools/test/mcpserver
 * @param {any} data
 */

export const reqAgentToolTestMCPServer = (data: any) => {
  return request({
    url: `/agent/tools/test/mcpserver`,
    method: 'POST',
    data,
  });
};

export const reqAgentToolInvokeMCPServer = (data: any) => {
  return request({
    url: `/agent/tools/test/mcpserver/invoke`,
    method: 'POST',
    data,
  });
};
