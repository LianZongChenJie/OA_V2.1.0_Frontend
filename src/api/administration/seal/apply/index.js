import request from '@/utils/request'

// 用章申请分页列表
export function getPageList(query) {
  return request({
    url: '/administrative/seal/list',
    method: 'get',
    params: query
  })
}
// 用章申请详情
export function getDetail(id) {
  return request({
    url: '/administrative/seal/detail/' + id,
    method: 'get'
  })
}

// 新增用章申请
export function add(data) {
  return request({
    url: '/administrative/seal/add',
    method: 'post',
    data
  })
}

// 编辑用章申请
export function edit(data) {
  return request({
    url: '/administrative/seal/edit',
    method: 'post',
    data
  })
}

// 撤销用章申请
export function cancel(data) {
  return request({
    url: '/administrative/seal/cancel/' + id,
    method: 'put',
    data
  })
}

// 删除用章申请
export function del(ids) {
  return request({
    url: '/administrative/seal/delete/'+ids,
    method: 'delete'
  })
} 

// 通过用章申请
export function pass(data) {
  return request({
    url: '/administrative/seal/pass',
    method: 'post',
    data
  })
}

// 驳回用章申请
export function reject(data) {
  return request({
    url: '/administrative/seal/reject',
    method: 'post',
    data
  })
}