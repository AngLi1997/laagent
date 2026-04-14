import request from '@/services';

/**
 * @description: 删除知识库分类 /api/app/agent/knowledge/base/category
 * @param {string} id
 */
export const reqKnowledgeBaseCategoryDelete = (id: string) => {
  return request({
    url: `/agent/knowledge/base/category?id=${id}`,
    method: 'DELETE',
  });
};

/**
 * @description: 创建知识库分类 /api/app/agent/knowledge/base/category
 * @param {any} data
 */
export const reqKnowledgeBaseCategoryCreate = (data: any) => {
  return request({
    url: `/agent/knowledge/base/category`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 编辑知识库分类 /api/app/agent/knowledge/base/category
 * @param {any} data
 */
export const reqKnowledgeBaseCategoryUpdate = (data: any) => {
  return request({
    url: `/agent/knowledge/base/category`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 知识库分类树 /api/app/agent/knowledge/base/category/tree
 */
export const reqKnowledgeBaseCategoryTree = () => {
  return request({
    url: `/agent/knowledge/base/category/tree`,
    method: 'GET',
  });
};

/**
 * @description: 创建知识库并返回知识库id /api/app/agent/knowledge/base/create
 * @param {any} data
 */
export const reqKnowledgeBaseCreate = (data: any) => {
  return request({
    url: `/agent/knowledge/base/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 删除知识库 /api/app/agent/knowledge/base/delete
 * @param {string} id
 */
export const reqKnowledgeBaseDelete = (id: string) => {
  return request({
    url: `/agent/knowledge/base/delete?id=${id}`,
    method: 'DELETE',
  });
};

/**
 * @description: 停用知识库 /api/app/agent/knowledge/base/disable
 * @param {string} id
 */
export const reqKnowledgeBaseDisable = (id: string) => {
  return request({
    url: `/agent/knowledge/base/disable?id=${id}`,
    method: 'PUT',
  });
};

/**
 * @description: 编辑知识库信息 /api/app/agent/knowledge/base/edit
 * @param {any} data
 */
export const reqKnowledgeBaseEdit = (data: any) => {
  return request({
    url: `/agent/knowledge/base/edit`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 启用知识库 /api/app/agent/knowledge/base/enable
 * @param {string} id
 */
export const reqKnowledgeBaseEnable = (id: string) => {
  return request({
    url: `/agent/knowledge/base/enable?id=${id}`,
    method: 'PUT',
  });
};

/**
 * @description: 查询知识库分页 /api/app/agent/knowledge/base/page
 * @param {any} params
 */
export const reqKnowledgeBasePage = (params: any) => {
  return request({
    url: `/agent/knowledge/base/page`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 文档分类树(带文档列表) /api/app/agent/knowledge/document/category/documents_tree
 */
export const reqKnowledgeDocumentCategoryDocumentsTree = () => {
  return request({
    url: `/agent/knowledge/document/category/documents_tree`,
    method: 'GET',
  });
};

/**
 * @description: 查询知识库详情 /api/app/agent/knowledge/base/info
 * @param {string} id
 */
export const reqKnowledgeBaseInfo = (id: string) => {
  return request({
    url: `/agent/knowledge/base/info`,
    method: 'GET',
    params: { id },
  });
};

/**
 * @description: 召回 /api/app/agent/knowledge/base/retrieval
 * @param {any} data
 */
export const reqKnowledgeBaseRetrieval = (data: any) => {
  return request({
    url: `/agent/knowledge/base/retrieval`,
    method: 'POST',
    data,
  });
};
