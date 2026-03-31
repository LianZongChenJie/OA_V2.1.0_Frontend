import request from '@/utils/request'

// 获取常规数据分页列表
export function getPageList(query) {
  return request({
    url: '/system/basicUser/list',
    method: 'get',
    params: query
  })
}

// 获取常规数据详情
export function getDetail(id) {
  return request({
    url: `/system/basicUser/${id}`,
    method: 'get'
  })
}

// 新增常规数据
export function addenterPrise(data) {
  return request({
    url: '/system/basicUser',
    method: 'post',
    data: data
  })
}

// 更新常规数据
export function updateenterPrise(data) {
  return request({
    url: `/system/basicUser`,
    method: 'put',
    data: data
  })
}


// 修改常规数据状态
export function updateStatus(data) {
  return request({
    url: `/system/basicUser/${id}`,
    method: 'delete',
    data: data
  })
}


0