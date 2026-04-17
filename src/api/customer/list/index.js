import request from '@/utils/request'

// 查询客户列表
export function getPageList(query) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: query
  })
}

// 新增客户
export function add(data) {
  return request({
    url: '/system/customer',
    method: 'post',
    data
  })
}

// 修改客户
export function edit(data) {
  return request({
    url: '/system/customer',
    method: 'put',
    data
  })
}

// 删除客户
export function del(id) {
  return request({
    url: '/system/customer/' + id,
    method: 'delete'
  })
}

// 客户详情
export function getDetail(id) {
  return request({
    url: '/system/customer/' + id,
    method: 'get'
  })
}

// 导出客户列表 模版
export function exportXls(query) {
  return request({
    url: '/common/import/customer/template',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 导入客户列表
export function importXls(data) {
  return request({
    url: '/common/import/customer?type=sea',
    method: 'post',
    data
  })
}
