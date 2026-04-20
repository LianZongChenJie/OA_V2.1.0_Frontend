import request from '@/utils/request'

// 获取借支管理分页列表
export function getPageList(query) {
  return request({
    url: '/finance/expense/list',
    method: 'get',
    params: query
  })
}

// 新增报销管理
export function add(data) {
  return request({
    url: '/finance/expense/add',
    method: 'post',
    data
  })
}

// 编辑报销管理
export function edit(data) {
  return request({
    url: '/finance/expense/update',
    method: 'post',
    data
  })
}

// 删除报销管理
export function del(id) {
  return request({
    url: '/finance/expense/delete/' + id,
    method: 'delete'
  })
}

// 报销管理详情
export function getDetail(id) {
  return request({
    url: '/finance/expense/detail/' + id,
    method: 'get'
  })
}

