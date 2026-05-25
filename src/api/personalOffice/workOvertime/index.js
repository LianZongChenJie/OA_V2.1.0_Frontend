import request from '@/utils/request'

// 加班分页列表
export function getPageList(query) {
  return request({
    url: '/home/overtimes/list',
    method: 'get',
    params: query
  })
}

// 新增加班申请
export function add(data) {
  return request({
    url: '/system/overtimes',
    method: 'post',
    data
  })
}
// 编辑加班申请
export function edit(data) {
  return request({
    url: '/system/overtimes',
    method: 'put',
    data
  })
}
// 加班申请详情
export function getDetail(id) {
  return request({
    url: '/system/overtimes/' + id,
    method: 'get'
  })
}
// 删除加班申请
export function del(id) {
  return request({
    url: '/system/overtimes/' + id,
    method: 'delete'
  })
}
