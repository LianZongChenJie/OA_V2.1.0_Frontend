import request from '@/utils/request'

// 获取车辆费用分页列表
export function getPageList(query) {
  return request({
    url: '/system/car/fee/list',
    method: 'get',
    params: query
  })
}

// 获取车辆费用详情
export function getDetail(id) {
  return request({
    url: `/system/car/fee/${id}`,
    method: 'get'
  })
}

// 新增车辆费用
export function addenterPrise(data) {
  return request({
    url: '/system/car/fee',
    method: 'post',
    data: data
  })
}

// 更新车辆费用
export function updateenterPrise(data) {
  return request({
    url: `/system/car/fee`,
    method: 'put',
    data: data
  })
}



// 删除车辆费用接口
export function deletereward(id) {
  return request({
    url: `/system/car/fee/${id}`,
    method: 'delete'
  })
}
