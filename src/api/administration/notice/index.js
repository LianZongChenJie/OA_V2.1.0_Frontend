import request from '@/utils/request'

// 公告列表分页列表
export function getPageList(query) {
  return request({
    url: '/administrative/note/list',
    method: 'get',
    params: query
  })
}

// 公告详情
export function getDetail(id) {
  return request({
    url: '/administrative/note/detail/' + id,
    method: 'get'
  })
}

// 公告新增
export function add(data) {
  return request({
    url: '/administrative/note/add',
    method: 'post',
    data
  })
} 

// 公告更新
export function edit(data) {
  return request({
    url: '/administrative/note/update',
    method: 'put',
    data
  })
}

// 公告删除
export function del(ids) {
  return request({
    url: '/administrative/note/' + ids,
    method: 'delete'
  })
}
