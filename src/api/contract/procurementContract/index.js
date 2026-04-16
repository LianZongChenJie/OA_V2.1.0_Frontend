import request from '@/utils/request'

// 获取销售合同分页列表
export function getPageList(query) {
  return request({
    url: '/system/purchase/list',
    method: 'get',
    params: query
  })
}

// 新增销售合同
export function add(data) {
  return request({
    url: '/system/purchase',
    method: 'post',
    data: data
  })
}

// 修改销售合同
export function edit(data) {
  return request({
    url: '/system/purchase',
    method: 'put',
    data: data
  })
}

// 删除销售合同
export function del(id) {
  return request({
    url: '/system/purchase/' + id,
    method: 'delete'
  })
}

// 获取销售合同详情
export function getDetail(id) {
  return request({
    url: '/system/purchase/' + id,
    method: 'get'
  })
}
