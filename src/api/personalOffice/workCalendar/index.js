import request from '@/utils/request'

// 公司新闻分页列表
export function getDateList(query) {
  return request({
    url: '/dashboard/schedule/calendar/list',
    method: 'get',
    params: query
  })
}

// 添加日程日历
export function addDate(data) {
  return request({
    url: '/dashboard/schedule/add',
    method: 'post',
    data
  })
}

// 详情
export function detail(id) {
  return request({
    url: '/dashboard/schedule/detail/'+id,
    method: 'get',
  })
}
