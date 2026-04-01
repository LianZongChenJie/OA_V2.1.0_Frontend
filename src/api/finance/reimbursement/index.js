import request from '@/utils/request'

// 获取报销类型列表
export function getPageList(query) {
  return request({
    url: '/basicdata/finance/reimbursement/list',
    method: 'get',
    params: query
  })
}
// 获取报销类型详情
export function getDetail(id) {
  return request({
    url: `/basicdata/finance/reimbursement/detail/${id}`,
    method: 'get'
  })
}
// 新增报销类型
export function addReimbursement(data) {
  return request({
    url: '/basicdata/finance/reimbursement/add',
    method: 'post',
    data
  })
}
// 修改报销类型
export function updateReimbursement(data) {
  return request({
    url: `/basicdata/finance/reimbursement/update`,
    method: 'put',
    data
  })
}
// 修改报销类型状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/finance/reimbursement/changeStatus`,
    method: 'put',
    data
  })
}

