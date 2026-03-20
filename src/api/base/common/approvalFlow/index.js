import request from '@/utils/request'

// 获取审批流程分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/flow/list',
    method: 'get',
    params: query
  })
}

// 获取审批流程详情
export function getDetail(id) {
  return request({
    url: '/basicdata/flow/detail/' + id,
    method: 'get'
  })
}

// 新增审批流程
export function addFlow(data) {
  return request({
    url: '/basicdata/flow/add',
    method: 'post',
    data
  })
}

// 修改审批流程
export function updateFlow(id, data) {
  return request({
    url: `/basicdata/flow/update`,
    method: 'put',
    data
  })
}

// 修改审批流程状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/flow/changeStatus`,
    method: 'put',
    data
  })
}   
