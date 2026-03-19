import request from '@/utils/request'

// 获取审批类型分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/flowCate/list',
    method: 'get',
    params: query
  })
}
 
// 获取审批类型详情
export function getDetail(id) {
  return request({
    url: '/basicdata/flowCate/detail/' + id,
    method: 'get'
  })
}
 
// 新增审批类型
export function addApprovalType(data){
  return request({
    url: '/basicdata/flowCate/add',
    method: 'post',
    data: data
  })
}
 
// 修改编辑审批类型
export function updateApprovalType(data){
  return request({
    url: '/basicdata/flowCate/update',
    method: 'put',
    data: data
  })
}

// 删除|禁用审批类型
export function updateApprovalTypeStatus(id){
  return request({
    url: '/basicdata/flowCate/delete/'+id,
    method: 'put',
  })
}