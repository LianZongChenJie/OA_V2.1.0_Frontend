import request from '@/utils/request'

// 获取客户常规数据
export function getPageList(query) {
  return request({
    url: '/basicdata/customer/basic/list',
    method: 'get',
    params: query
  })
}

// 获取客户常规详情
export function getDetail(id) {
  return request({
    url: '/basicdata/customer/basic/detail/' + id,
    method: 'get'
  })
} 

// 新增客户常规
export function addRegular(data) {
  return request({
    url: '/basicdata/customer/basic/add',
    method: 'post',
    data
  })
}

// 修改客户常规
export function updateRegular(data) {
  return request({
    url: '/basicdata/customer/basic/update',
    method: 'put',
    data
  })
}

// 修改状态

export function updateStatus(data) {
  return request({
    url: '/basicdata/customer/basic/changeStatus',
    method: 'put',
    data
  })
}



