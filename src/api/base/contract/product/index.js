import request from '@/utils/request'

// 获取产品分页列表
export function getPageList(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}

// 获取产品详情
export function getDetail(id) {
  return request({
    url: `/system/product/${id}`,
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data
  })
}
//修改产品
export function updateProduct(data) {
  return request({
    url: `/system/product`,
    method: 'put',
    data
  })
}
// 删除产品
export function deleteProduct(id) {
  return request({
    url: `/system/product/${id}`,
    method: 'delete'
  })  
}

// 修改状态
export function updateStatus(data) {
  return request({
    url: `/system/product/set`,
    method: 'put',
    data
  })
}