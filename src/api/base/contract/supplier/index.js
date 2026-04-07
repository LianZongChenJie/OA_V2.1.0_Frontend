import request from '@/utils/request'

// 获取供应商列表分页列表
export function getPageList(query) {
  return request({
    url: '/system/supplier/list',
    method: 'get',
    params: query
  })
}

// 新增供应商列表
export function addMessageModule(data) {
  return request({
    url: '/system/supplier',
    method: 'post',
    data: data
  })
}

// 获取供应商详情
export function getMessageModuleDetail(id) {
  return request({
    url: `/system/supplier/${id}`,
    method: 'get'
  })
}

// 更新供应商接口
export function updateMessageModule(data) {
  return request({
    url: '/system/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商接口
export function deleteMessageModule(id) {
  return request({
    url: `/system/supplier/${id}`,
    method: 'delete'
  })
}

// 修改供应商状态
export function updateStatus(id,data) {
  return request({
    url: `/system/supplier/set`, 
    method: 'put',
    data: { id, ...data }
  })  
}
