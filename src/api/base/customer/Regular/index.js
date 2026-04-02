import request from '@/utils/request'

// 获取常规数据分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/customer/basic/list',
    method: 'get',
    params: query
  })
}

// 获取常规数据详情
export function getDetail(id) {
  return request({
    url: `/basicdata/customer/basic/detail/${id}`,
    method: 'get'
  })
}

// 新增常规数据
export function addenterPrise(data) {
  return request({
    url: '/basicdata/customer/basic/add',
    method: 'post',
    data: data
  })
}

// 更新常规数据
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/customer/basic/update`,
    method: 'put',
    data: data
  })
}


// 修改常规数据状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/customer/basic/changeStatus`,
    method: 'put',
    data: { id, ...data }
  })
}

