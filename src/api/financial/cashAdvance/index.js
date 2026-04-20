import request from '@/utils/request'

// 获取借支管理分页列表
export function getPageList(query) {
  return request({
    url: '/finance/loan/list',
    method: 'get',
    params: query
  })
}

// 新增借支管理
export function add(data) {
  return request({
    url: '/finance/loan/add',
    method: 'post',
    data
  })
}

// 编辑借支管理
export function edit(data) {
  return request({
    url: '/finance/loan/update',
    method: 'post',
    data
  })
}

// 删除借支管理
export function del(id) {
  return request({
    url: '/finance/loan/delete/' + id,
    method: 'delete'
  })
}

// 借支管理详情
export function getDetail(id) {
  return request({
    url: '/finance/loan/detail/' + id,
    method: 'get'
  })
}

