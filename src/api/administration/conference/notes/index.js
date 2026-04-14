import request from '@/utils/request'

// 获取会议记录分页列表
export function getPageList(query) {
  return request({
    url: '/system/meeting/records/list',
    method: 'get',
    params: query
  })
}

// 获取会议记录详情
export function getDetail(id) {
  return request({
    url: `/system/meeting/records/${id}`,
    method: 'get'
  })
}

// 新增会议记录
export function addenterPrise(data) {
  return request({
    url: '/system/meeting/records',
    method: 'post',
    data: data
  })
}

// 更新会议记录
export function updateenterPrise(data) {
  return request({
    url: `/system/meeting/records`,
    method: 'put',
    data: data
  })
}



// 删除会议记录接口
export function deletereward(id) {
  return request({
    url: `/system/meeting/records/${id}`,
    method: 'delete'
  })
}
