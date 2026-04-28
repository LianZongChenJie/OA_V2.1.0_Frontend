import request from '@/utils/request'

// 日程安排分页列表
export function getPageList(query) {
  return request({
    url: '/oa/plan/datalist',
    method: 'get',
    params: query
  })
}

// 日程安排详情
export function getDetail(id) {
  return request({
    url: '/oa/plan/detail/' + id,
    method: 'get'
  })
}

// 日程安排新增
export function add(data) {
  return request({
    url: '/oa/plan/add',
    method: 'post',
    data
  })
} 

// 日程安排更新
export function edit(data) {
  return request({
    url: '/oa/plan/update',
    method: 'put',
    data
  })
}

// 日程安排删除
export function del(id) {
  return request({
    url: '/oa/plan/del/' + id,
    method: 'delete'
  })
}
