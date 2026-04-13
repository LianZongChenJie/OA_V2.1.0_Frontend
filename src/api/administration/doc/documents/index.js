import request from '@/utils/request'

// 公文列表分页列表
export function getPageList(query) {
  return request({
    url: '/system/official/list',
    method: 'get',
    params: query
  })
}

// 代审公文分页列表
export function getPageListForReview(query) {
  return request({
    url: '/system/official/pending',
    method: 'get',
    params: query
  })
}

// 已审公文分页列表
export function getPageListForAudit(query) {
  return request({
    url: '/system/official/reviewed',
    method: 'get',
    params: query
  })
}

// 公文详情
export function getDetail(id) {
  return request({
    url: '/system/official/' + id,
    method: 'get'
  })
}

// 公文新增
export function add(data) {
  return request({
    url: '/system/official',
    method: 'post',
    data: data
  })
}

// 公文修改
export function edit(data) {
  return request({
    url: '/system/official',
    method: 'put',
    data: data
  })
}

// 公文删除
export function del(ids) {
  return request({
    url: '/system/official/' + ids,
    method: 'delete',
  })
}
