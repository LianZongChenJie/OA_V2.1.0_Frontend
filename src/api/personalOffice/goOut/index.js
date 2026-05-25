import request from '@/utils/request'

// 外出分页列表
export function getPageList(query) {
  return request({
    url: '/home/outs/list',
    method: 'get',
    params: query
  })
}

// 新增外出申请
export function add(data) {
  return request({
    url: '/home/outs/add',
    method: 'post',
    data
  })
}
// 外出申请详情
export function getDetail(id) {
  return request({
    url: '/home/outs/view/' + id,
    method: 'get'
  })
}
// 删除外出申请
export function del(id) {
  return request({
    url: '/home/outs/del/' + id,
    method: 'delete'
  })
}
