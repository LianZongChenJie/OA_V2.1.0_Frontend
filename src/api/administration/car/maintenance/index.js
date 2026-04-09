import request from '@/utils/request'

// 获取车辆信息分页列表
export function getPageList(query) {
  return request({
    url: '/system/car/repair/list',
    method: 'get',
    params: query
  })
}

// 获取车辆信息详情
export function getDetail(id) {
  return request({
    url: `/system/car/repair/${id}`,
    method: 'get'
  })
}

// 新增车辆信息
export function addenterPrise(data) {
  return request({
    url: '/system/car/repair',
    method: 'post',
    data: data
  })
}

// 更新车辆信息
export function updateenterPrise(data) {
  return request({
    url: `/system/car/repair`,
    method: 'put',
    data: data
  })
}



// 删除车辆信息接口
export function deletereward(id) {
  return request({
    url: `/system/car/repair/${id}`,
    method: 'delete'
  })
}
