import request from '@/utils/request'

// 公司新闻分页列表
export function getPageList(query) {
  return request({
    url: '/administrative/news/list',
    method: 'get',
    params: query
  })
}

// 公司新闻详情
export function getDetail(id) {
  return request({
    url: '/administrative/news/detail/' + id,
    method: 'get'
  })
}

// 公司新闻新增
export function add(data) {
  return request({
    url: '/administrative/news/add',
    method: 'post',
    data
  })
} 

// 公司新闻更新
export function edit(data) {
  return request({
    url: '/administrative/news/update',
    method: 'put',
    data
  })
}

// 公司新闻删除
export function del(ids) {
  return request({
    url: '/administrative/news/delete/' + ids,
    method: 'delete'
  })
}
