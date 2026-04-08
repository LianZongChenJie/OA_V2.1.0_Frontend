import request from '@/utils/request'

// 资产信息分页列表
export function getPageList(query) {
  return request({
    url: '/system/property/list',
    method: 'get',
    params: query
  })
}

// 资产信息详情
export function getDetail(id) {
  return request({
    url: '/system/property/detail/' + id,
    method: 'get'
  })
}

// 新增资产信息
export function add(data) {
  return request({
    url: '/system/property',
    method: 'post',
    data
  })
}

// 修改资产信息
export function edit(data) {
  return request({
    url: '/system/property',
    method: 'put',
    data
  })
}

// 删除资产信息
export function del(id) {
  return request({
    url: '/system/property/' + id,
    method: 'delete'
  })
}

//修改资产信息状态
export function updateStatus(data) {
  return request({
    url: '/system/property/set',
    method: 'put',
    data
  })
}


