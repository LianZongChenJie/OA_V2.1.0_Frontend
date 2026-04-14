import request from '@/utils/request'

// 获取会议室预定分页列表
export function getPageList(query) {
  return request({
    url: '/system/meeting/order/list',
    method: 'get',
    params: query
  })
}

// 获取会议室预定详情
export function getDetail(id) {
  return request({
    url: `/system/meeting/order/${id}`,
    method: 'get'
  })
}

// 新增会议室预定
export function addenterPrise(data) {
  return request({
    url: '/system/meeting/order',
    method: 'post',
    data: data
  })
}

// 更新会议室预定
export function updateenterPrise(data) {
  return request({
    url: `/system/meeting/order`,
    method: 'put',
    data: data
  })
}



// 删除会议室预定接口
export function deletereward(id) {
  return request({
    url: `/system/meeting/order/${id}`,
    method: 'delete'
  })
}
