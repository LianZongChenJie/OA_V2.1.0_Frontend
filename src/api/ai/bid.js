import request from '@/utils/request'

// 上传投标文件
export function uploadBidDocument(data, onProgress) {
  return request({
    url: '/bid/upload',
    method: 'post',
    data: data,
    timeout: 600000,  // 投标文件解析可能较久，超时设为10分钟
    onUploadProgress: onProgress,
  })
}

// 查询投标文件列表
export function listBidDocument(query) {
  return request({
    url: '/bid/list',
    method: 'get',
    params: query,
  })
}

// 查询投标文件详情
export function getBidDetail(bidId) {
  return request({
    url: '/bid/detail/' + bidId,
    method: 'get',
  })
}

// 查询投标文件解析进度
export function getBidProgress(bidUuid) {
  return request({
    url: '/bid/progress/' + bidUuid,
    method: 'get',
  })
}

// 删除投标文件
export function delBidDocument(bidId) {
  return request({
    url: '/bid/delete/' + bidId,
    method: 'delete',
  })
}
