import request from '@/utils/request'

// 上传招标文件
export function uploadTenderDocument(data, onProgress) {
  return request({
    url: '/ai/tender/upload',
    method: 'post',
    data: data,
    timeout: 180000,
    onUploadProgress: onProgress,
  })
}

// 查询招标文件列表
export function listTenderDocument(query) {
  return request({
    url: '/ai/tender/list',
    method: 'get',
    params: query,
  })
}

// 查询招标文件详情
export function getTenderDetail(tenderId) {
  return request({
    url: '/ai/tender/detail/' + tenderId,
    method: 'get',
  })
}

// 获取结构化招标要求
export function getTenderRequirements(tenderId) {
  return request({
    url: '/ai/tender/requirements/' + tenderId,
    method: 'get',
  })
}

// 执行人员匹配推荐
export function matchPersonnel(tenderId) {
  return request({
    url: '/ai/tender/match/' + tenderId,
    method: 'post',
    timeout: 60000,
  })
}

// 获取匹配结果列表
export function getMatchResult(tenderId) {
  return request({
    url: '/ai/tender/match-result/' + tenderId,
    method: 'get',
  })
}

// 选择/取消选择人员
export function selectPersonnel(data) {
  return request({
    url: '/ai/tender/select-personnel',
    method: 'post',
    data: data,
  })
}

// 生成投标文件
export function generateBidFile(data) {
  return request({
    url: '/ai/tender/generate',
    method: 'post',
    data: data,
    timeout: 120000,
  })
}

// 下载生成的投标文件
export function downloadBidFile(tenderId) {
  return request({
    url: '/ai/tender/download/' + tenderId,
    method: 'get',
    responseType: 'blob',
  })
}

// 删除招标文件
export function delTenderDocument(tenderId) {
  return request({
    url: '/ai/tender/delete/' + tenderId,
    method: 'delete',
  })
}
