import request from '@/utils/request'

// 获取印章分页列表
export function getPageList(query) {
  return request({
    url: '/system/sealCate/list',
    method: 'get',
    params: query
  })
}

// 获取印章详情
export function getDetail(id) {
  return request({
    url: `/system/sealCate/${id}`,
    method: 'get'
  })
}

// 新增印章
export function addenterPrise(data) {
  return request({
    url: '/system/sealCate',
    method: 'post',
    data: data
  })
}

// 更新印章
export function updateenterPrise(data) {
  return request({
    url: `/system/sealCate`,
    method: 'put',
    data: data
  })
}


// 修改印章状态
export function updateStatus(id,data) {
  return request({
    url: `/system/sealCate/${id}`,
    method: 'delete',
  })
}

