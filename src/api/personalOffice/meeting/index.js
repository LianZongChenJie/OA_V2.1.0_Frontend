import request from '@/utils/request'

// 会议纪要分页列表
export function getPageList(query) {
  return request({
    url: '/system/meeting/records/user/list',
    method: 'get',
    params: query
  })
}

// 会议纪要详情
export function getDetail(id) {
  return request({
    url: '/system/meeting/records/' + id,
    method: 'get'
  })
}

