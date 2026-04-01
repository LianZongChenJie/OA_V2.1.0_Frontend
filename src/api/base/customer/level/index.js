import request from '@/utils/request'

// 获取客户等级分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/customer/gradle/list',
    method: 'get',
    params: query
  })
}

// 获取客户等级详情
export function getDetail(id) {
  return request({
    url: `/basicdata/customer/gradle/detail/${id}`,
    method: 'get'
  })
}

// 新增客户等级
export function addenterPrise(data) {
  return request({
    url: '/basicdata/customer/gradle/add',
    method: 'post',
    data: data
  })
}

// 更新客户等级
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/customer/gradle/update`,
    method: 'put',
    data: data
  })
}


// 修改客户等级状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/customer/gradle/changeStatus/${id}`,
    method: 'put',
    data: data
  })
}

