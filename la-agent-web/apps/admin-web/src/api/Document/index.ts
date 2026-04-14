import request from '@/services';

export * from './KnowledgeBase';

/**
 * @description: 文档分类树 /agent/knowledge/document/category/tree
 */
export const reqDocumentCategoryTree = () => {
  return request({
    url: `/agent/knowledge/document/category/tree`,
    method: 'GET',
  });
};

/**
 * @description: 创建文档分类 /agent/knowledge/document/category
 * @param {any} data
 */
export const reqDocumentCategoryCreate = (data: any) => {
  return request({
    url: `/agent/knowledge/document/category`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 编辑文档分类 /api/app/agent/knowledge/document/category
 * @param {any} data
 */
export const reqDocumentCategoryUpdate = (data: any) => {
  return request({
    url: `/agent/knowledge/document/category`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除文档分类 /agent/knowledge/document/category
 * @param {any} params
 */
export const reqDocumentCategoryRemove = (params: any) => {
  return request({
    url: `/agent/knowledge/document/category`,
    method: 'DELETE',
    params,
  });
};

/**
 * @description: 查询文档分页 /agent/knowledge/document/page
 */
export const reqDocumentPage = (params: any) => {
  return request({
    url: `/agent/knowledge/document/page`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 启用文档 /agent/knowledge/document/enable
 * @param {any} params
 */
export const reqDocumentEnable = (params: any) => {
  return request({
    url: `/agent/knowledge/document/enable`,
    method: 'PUT',
    params,
  });
};

/**
 * @description: 停用文档 /agent/knowledge/document/disable
 * @param {any} params
 */
export const reqDocumentDisable = (params: any) => {
  return request({
    url: `/agent/knowledge/document/disable`,
    method: 'PUT',
    params,
  });
};

/**
 * @description: 创建文档并返回文件id /api/app/agent/knowledge/document/create
 * @param {any} data
 */
export const reqDocumentCreate = (data: any) => {
  return request({
    url: `/agent/knowledge/document/create`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 上传文档并返回文件id /agent/knowledge/document/upload
 * @param {any} data
 */
export const reqDocumentUpload = (data: any) => {
  return request({
    url: `/agent/knowledge/document/upload`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * @description: 编辑文档信息 /agent/knowledge/document/edit
 */
export const reqDocumentEdit = (data: any) => {
  return request({
    url: `/agent/knowledge/document/edit`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除文档 /agent/knowledge/document/delete
 * @param {any} params
 */
export const reqDocumentDelete = (params: any) => {
  return request({
    url: `/agent/knowledge/document/delete`,
    method: 'DELETE',
    params,
  });
};

/**
 * @description: 文档分段（预览） /agent/knowledge/document/split
 * @param {any} data
 */
export const reqDocumentSplit = (data: any) => {
  return request({
    url: `/agent/knowledge/document/split`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 查询文档分段分页 /agent/knowledge/document/chunk/page
 * @param {any} params
 */
export const reqDocumentChunkPage = (params: any) => {
  return request({
    url: `/agent/knowledge/document/chunk/page`,
    method: 'GET',
    params,
  });
};

/**
 * @description: 文档分段保存 /agent/knowledge/document/split/save
 * @param {any} data
 */
export const reqDocumentSplitSave = (data: any) => {
  return request({
    url: `/agent/knowledge/document/split/save`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 新增文本片段 /api/app/agent/knowledge/document/chunk
 * @param {any} data
 */
export const reqDocumentChunkCreate = (data: any) => {
  return request({
    url: `/agent/knowledge/document/chunk`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 修改文本片段 /api/app/agent/knowledge/document/chunk
 * @param {any} data
 */
export const reqDocumentChunkUpdate = (data: any) => {
  return request({
    url: `/agent/knowledge/document/chunk`,
    method: 'PUT',
    data,
  });
};

/**
 * @description: 删除文本片段 /agent/knowledge/document/chunk
 * @param {any} params
 */
export const reqDocumentChunkDelete = (params: any) => {
  return request({
    url: `/agent/knowledge/document/chunk`,
    method: 'DELETE',
    params,
  });
};

/**
 * @description: 文档召回测试 /api/app/agent/knowledge/document/retrieval
 * @param {any} data
 */
export const reqDocumentRetrieval = (data: any) => {
  return request({
    url: `/agent/knowledge/document/retrieval`,
    method: 'POST',
    data,
  });
};
