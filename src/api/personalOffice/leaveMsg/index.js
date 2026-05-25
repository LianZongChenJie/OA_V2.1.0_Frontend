import request from '@/utils/request'

// 请假分页列表
export function getPageList(query) {
  return request({
    url: '/home/leaves/list',
    method: 'get',
    params: query
  })
}

// 新增请假
export function add(data) {
  return request({
    url: '/home/leaves/add',
    method: 'post',
    data
  })
}
// 请假详情
export function getDetail(id) {
  return request({
    url: '/home/leaves/view/' + id,
    method: 'get'
  })
}
// 删除请假
export function del(id) {
  return request({
    url: '/home/leaves/del/' + id,
    method: 'delete'
  })
}
