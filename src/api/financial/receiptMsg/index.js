import request from '@/utils/request'

// 获取收票管理分页列表
export function getPageList(query) {
  return request({
    url: '/finance/ticket/list',
    method: 'get',
    params: query
  })
}
// 获取收票管理详情
export function getDetail(id) {
  return request({
    url: `/finance/ticket/detail/${id}`,
    method: 'get'
  })
} 
// 新增收票管理 
export function add(data) {
  return request({
    url: '/finance/ticket/add',
    method: 'post',
    data
  })
}
// 更新收票管理
export function update(data) {
  return request({
    url: '/finance/ticket/add',
    method: 'put',
    data
  })
}
// 删除收票管理
export function del(ids) {
  return request({
    url: '/finance/ticket/delete/' + ids,
    method: 'delete'
  })
}
// 更新收票管理状态
export function updateStatus(data) {
  return request({
    url: '/finance/ticket/openStatus',
    method: 'put',
    data
  })
}