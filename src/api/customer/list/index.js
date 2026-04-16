import request from '@/utils/request'

// 查询参数列表
export function getPageList(query) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: query
  })
}
