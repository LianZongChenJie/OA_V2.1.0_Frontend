import request from '@/utils/request'

// 获取资产品牌分页列表
export function getPageList(query) {
  return request({
    url: '/system/propertyBrand/list',
    method: 'get',
    params: query
  })
}

// 获取资产品牌详情
export function getDetail(id) {
  return request({
    url: `/system/propertyBrand/${id}`,
    method: 'get'
  })
}

// 新增资产品牌
export function addenterPrise(data) {
  return request({
    url: '/system/propertyBrand',
    method: 'post',
    data: data
  })
}

// 更新资产品牌
export function updateenterPrise(data) {
  return request({
    url: `/system/propertyBrand`,
    method: 'put',
    data: data
  })
}


// 修改资产品牌状态
export function updateStatus(id,data) {
  return request({
    url: `/system/propertyBrand/set`,
    method: 'put',
    data: { id, ...data }
  })
}

