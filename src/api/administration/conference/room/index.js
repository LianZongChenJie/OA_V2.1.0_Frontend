import request from '@/utils/request'

// 获取会议室分页列表
export function getPageList(query) {
  return request({
    url: '/system/meeting/room/list',
    method: 'get',
    params: query
  })
}

// 获取会议室详情
export function getDetail(id) {
  return request({
    url: `/system/meeting/room/${id}`,
    method: 'get'
  })
}

// 新增会议室
export function addenterPrise(data) {
  return request({
    url: '/system/meeting/room',
    method: 'post',
    data: data
  })
}

// 更新会议室
export function updateenterPrise(data) {
  return request({
    url: `/system/meeting/room`,
    method: 'put',
    data: data
  })
}



// 删除会议室接口
export function deletereward(id) {
  return request({
    url: `/system/meeting/room/${id}`,
    method: 'delete'
  })
}
