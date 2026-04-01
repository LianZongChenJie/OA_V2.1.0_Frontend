import request from '@/utils/request'

// 获取客户渠道分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/customer/source/list',
    method: 'get',
    params: query
  })
}

// 获取客户渠道详情
export function getDetail(id) {
  return request({
    url: `/basicdata/customer/source/detail/${id}`,
    method: 'get'
  })
}

// 新增客户渠道
export function addenterPrise(data) {
  return request({
    url: '/basicdata/customer/source/add',
    method: 'post',
    data: data
  })
}

// 更新客户渠道
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/customer/source/update`,
    method: 'put',
    data: data
  })
}


// 修改客户渠道状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/customer/source/changeStatus/${id}`,
    method: 'put',
    data: data
  })
}

