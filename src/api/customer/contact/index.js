import request from '@/utils/request'

// 查询客户联系人列表
export function getPageList(query) {
  return request({
    url: '/system/customer-contact/list',
    method: 'get',
    params: query
  })
}

// 修改客户联系人
export function edit(data) {
  return request({
    url: '/system/customer-contact',
    method: 'put',
    data
  })
}

// 删除客户联系人
export function del(id) {
  return request({
    url: '/system/customer-contact/' + id,
    method: 'delete'
  })
}

// 客户联系人详情
export function getDetail(id) {
  return request({
    url: '/system/customer-contact/' + id,
    method: 'get'
  })
}
