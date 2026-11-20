import request from '@/utils/request'

// 废弃客户列表
export function getPageList(query) {
  return request({
    url: '/customer/index/trash',
    method: 'get',
    params: query
  })
}

// 废弃客户详情
export function getDetail(id) {
  return request({
    url: '/customer/index/trash/' + id,
    method: 'get'
  })
}

// 领取废弃客户
export function receiveCustomer(id) {
  return request({
    url: '/customer/index/trash/receive',
    method: 'post',
    params: { id }
  })
}
