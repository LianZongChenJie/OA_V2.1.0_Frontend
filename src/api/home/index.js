import request from '@/utils/request'

// 紧急事项
export function urgentList(query) {
  return request({
    url: '/dashboard/urgent',
    method: 'get',
    params: query
  })
}