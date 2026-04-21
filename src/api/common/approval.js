import request from '@/utils/request'

// 提交审批接口 将数据提交到审批流程中
export function submitToFlow(data) {
  return request({
    url: '/basicdata/check/submitCheck',
    method: 'post',
    data
  })
}
 
// 审批接口
export function approval(data) {
  return request({
    url: '/basicdata/check/submitCheck',
    method: 'post',
    data
  })
}

// 获取审批信息接口 /api/flow/getFlowNodes
export function getFlowNodes(data) {
  return request({
    url: '/basicdata/check/getFlow',
    method: 'get',
    params: data
  }) 
}

