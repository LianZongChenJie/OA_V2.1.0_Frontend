import request from '@/utils/request'

// 获取行业类型分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/customer/industry/list',
    method: 'get',
    params: query
  })
}

// 获取行业类型详情
export function getDetail(id) {
  return request({
    url: `/basicdata/customer/industry/detail/${id}`,
    method: 'get'
  })
}

// 新增行业类型
export function addenterPrise(data) {
  return request({
    url: '/basicdata/customer/industry/add',
    method: 'post',
    data: data
  })
}

// 更新行业类型
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/customer/industry/update`,
    method: 'put',
    data: data
  })
}


// 修改行业类型状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/customer/industry/changeStatus`, 
    method: 'put',
    data: { id, ...data }
  })
}

