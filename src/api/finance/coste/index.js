import request from '@/utils/request'

// 获取报销类型列表
export function getPageList(query) {
  return request({
    url: '/basicdata/finance/list',
    method: 'get',
    params: query
  })
}
// 获取报销类型详情
export function getDetail(id) {
  return request({
    url: `/basicdata/finance/detail/${id}`,
    method: 'get'
  })
}
// 新增报销类型
export function add(data) {
  return request({
    url: '/basicdata/finance/add',
    method: 'post',
    data
  })
}
// 修改报销类型
export function update(data) {
  return request({
    url: `/basicdata/finance/update`,
    method: 'put',
    data
  })
}
// 修改报销类型状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/finance/changeStatus`,
    method: 'put',
    data
  })
}

