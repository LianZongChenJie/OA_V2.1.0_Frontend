import request from '@/utils/request'

// 获取行政分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/basicAdm/list',
    method: 'get',
    params: query
  })
}

// 获取行政详情
export function getDetail(id) {
  return request({
    url: `/basicdata/basicAdm/${id}`,
    method: 'get'
  })
}

// 新增行政
export function addenterPrise(data) {
  return request({
    url: '/basicdata/basicAdm/add',
    method: 'post',
    data: data
  })
}

// 更新行政
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/basicAdm/update`,
    method: 'put',
    data: data
  })
}


// 修改行政状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/basicAdm/set/${id}`,
    method: 'put',
    data: data
  })
}

