import request from '@/utils/request'

// 查询客户跟进记录列表（可按客户 cid 筛选）
export function getPageList(query) {
  return request({
    url: '/system/customerTrace/list',
    method: 'get',
    params: query
  })
}

// 新增客户跟进记录
export function add(data) {
  return request({
    url: '/system/customerTrace',
    method: 'post',
    data
  })
}

// 修改客户跟进记录
export function edit(data) {
  return request({
    url: '/system/customerTrace',
    method: 'put',
    data
  })
}

// 删除客户跟进记录
export function del(id) {
  return request({
    url: '/system/customerTrace/' + id,
    method: 'delete'
  })
}

// 客户跟进记录详情
export function getDetail(id) {
  return request({
    url: '/system/customerTrace/' + id,
    method: 'get'
  })
}

// 下载跟进记录附件
export function downloadAttachment(traceId, fileName) {
  return request({
    url: '/system/customerTrace/attachment/download',
    method: 'get',
    params: { traceId, fileName },
    responseType: 'blob'
  })
}
