import request from '@/utils/request'

// 获取公告类型分页列表
export function getPageList(query) {
  return request({
    url: '/system/noteCate/list',
    method: 'get',
    params: query
  })
}

// 获取公告类型详情
export function getDetail(id) {
  return request({
    url: `/system/noteCate/${id}`,
    method: 'get'
  })
}

// 新增公告类型
export function addenterPrise(data) {
  return request({
    url: '/system/noteCate',
    method: 'post',
    data: data
  })
}

// 更新公告类型
export function updateenterPrise(data) {
  return request({
    url: `/system/noteCate`,
    method: 'put',
    data: data
  })
}


// 修改公告类型状态
export function updateStatus(id,data) {
  return request({
    url: `/system/noteCate/${id}`,
    method: 'delete',
  })
}

