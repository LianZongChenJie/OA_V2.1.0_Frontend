import request from '@/utils/request'

// 查询公海客户列表
export function getPageList(query) {
  return request({
    url: '/customer/index/sea',
    method: 'get',
    params: query
  })
}

// 移入公海客户列表
export function toOpenSea(data) {
  return request({
    url: '/customer/index/to-sea',
    method: 'post',
    params: data
  })
}

// 领取公海客户
export function getCustomer(id) {
  return request({
    url: '/customer/index/to-get/'+id,
    method: 'post',
  })
}
