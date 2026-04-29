import request from '@/utils/request'

// 公司新闻分页列表
export function getDateList(query) {
  return request({
    url: '/oa/plan/calendar',
    method: 'get',
    params: query
  })
}

// 添加日程日历
export function addDate(data) {
  return request({
    url: '/oa/plan/add',
    method: 'post',
    data
  })
}

// 详情
export function detail(id) {
  return request({
    url: '/oa/plan/detail/'+id,
    method: 'get',
  })
}
