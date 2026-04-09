import request from '@/utils/request'

// 维修记录分页列表
export function getPageList(query) {
  return request({
    url: '/system/property/repair/list',
    method: 'get',
    params: query
  })
}

// 维修记录新增
export function add(data) {
  return request({
    url: '/system/property/repair',
    method: 'post',
    data
  })
}

// 维修记录修改
export function update(data) {
  return request({
    url: '/system/property/repair',
    method: 'put',
    data
  })
}

// 维修记录删除
export function del(id) {
  return request({
    url: '/system/property/repair/' + id,
    method: 'delete'
  })
  }


// 维修记录详情
export function getDetail(id) {
  return request({
    url: '/system/property/repair/' + id,
    method: 'get'
  })
}

// 资产下拉列表（支持搜索）
export function getPropertyList(query) {
  return request({
    url: '/system/property/list',
    method: 'get',
    params: query
  })
}

// 跟进人下拉列表（支持搜索）
export function getUserList(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}