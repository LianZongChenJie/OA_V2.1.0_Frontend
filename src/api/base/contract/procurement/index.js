import request from '@/utils/request'

// 获取产品分页列表
export function getPageList(query) {
  return request({
    url: '/system/purchased/list',
    method: 'get',
    params: query
  })
}

// 获取产品详情
export function getDetail(id) {
  return request({
    url: `/system/purchased/${id}`,
    method: 'get'
  })
}

// 新增产品
export function addProcurement(data) {
  return request({
    url: '/system/purchased',
    method: 'post',
    data
  })
}
//修改产品
export function updateProcurement(data) {
  return request({
    url: `/system/purchased`,
    method: 'put',
    data
  })
}
// 删除产品
export function deleteProcurement(id) {
  return request({
    url: `/system/purchased/${id}`,
    method: 'delete'
  })  
}

// 修改状态
export function updateStatus(data) {
  return request({
    url: `/system/purchased/set`,
    method: 'put',
    data
  })
}