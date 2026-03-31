import request from '@/utils/request'

// 获取资产单位分页列表
export function getPageList(query) {
  return request({
    url: '/system/propertyUnit/list',
    method: 'get',
    params: query
  })
}

// 获取资产单位详情
export function getDetail(id) {
  return request({
    url: `/system/propertyUnit/${id}`,
    method: 'get'
  })
}

// 新增资产单位
export function addenterPrise(data) {
  return request({
    url: '/system/propertyUnit',
    method: 'post',
    data: data
  })
}

// 更新资产单位
export function updateenterPrise(data) {
  return request({
    url: `/system/propertyUnit`,
    method: 'put',
    data: data
  })
}


// 修改资产单位状态
export function updateStatus(id,data) {
  return request({
    url: `/system/propertyBrand/${id}`,
    method: 'delete',
    data: data
  })
}

