import request from '@/utils/request'

// 离职申请分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/quit/list',
    method: 'get',
    params: query
  })
}

// 离职申请详情
export function getDetail(id) {
  return request({
    url: '/personnel/quit/detail/' + id,
    method: 'get'
  })
}

// 新增离职申请
export function add(data) {
  return request({
    url: '/personnel/quit/add',
    method: 'post',
    data: data
  })
}

// 修改离职申请
export function edit(data) {
  return request({
    url: '/personnel/quit/update',
    method: 'put',
    data: data
  })
}

// 删除离职申请
export function del(ids) {
  return request({
    url: '/personnel/quit/delete/' + ids,
    method: 'delete'
  })
}
