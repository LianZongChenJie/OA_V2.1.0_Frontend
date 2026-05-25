import request from '@/utils/request'

// 出差分页列表
export function getPageList(query) {
  return request({
    url: '/home/trips/list',
    method: 'get',
    params: query
  })
}

// 新增出差申请
export function add(data) {
  return request({
    url: '/home/trips/add',
    method: 'post',
    data
  })
}
// 出差申请详情
export function getDetail(id) {
  return request({
    url: '/home/trips/view/' + id,
    method: 'get'
  })
}
// 删除出差申请
export function del(id) {
  return request({
    url: '/home/trips/del/' + id,
    method: 'delete'
  })
}
