import request from '@/utils/request'

// 黑名单列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/blackList/list',
    method: 'get',
    params: query
  })
}

// 黑名单详情
export function getDetail(id) {
  return request({
    url: '/personnel/blackList/detail/' + id,
    method: 'get'
  })
}

// 新增黑名单
export function addDeptChange(data) {
  return request({
    url: '/personnel/blackList/add',
    method: 'post',
    data: data
  })
}

// 修改黑名单
export function updateDeptChange(data) {
  return request({
    url: '/personnel/blackList/update',
    method: 'put',
    data: data
  })
}

// 删除黑名单
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/blackList/delete/' + id,
    method: 'delete'
  })
}

