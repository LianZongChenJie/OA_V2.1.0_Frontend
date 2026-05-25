import request from '@/utils/request'

// 紧急事项
export function urgentList(query) {
  return request({
    url: '/dashboard/urgent',
    method: 'get',
    params: query
  })
}
//待办事项
export function todoList(query) {
  return request({
    url: '/main/awaitReview',
    method: 'get',
    params: query
  })
}
//统计数量
export function countList(query) {
  return request({
    url: '/main/count',
    method: 'get',
    params: query
  })
}
