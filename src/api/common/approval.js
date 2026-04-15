import request from '@/utils/request'

// 提交审批接口 将数据提交到审批流程中
export function submitToFlow(data) {
  return request({
    url: '/api/flow/submitCheck',
    method: 'post',
    data
  })
}
 
// 审批接口
export function approval(data) {
  return request({
    url: '/api/flow/flowCheck',
    method: 'post',
    data
  })
}

// 获取审批信息接口 /api/flow/getFlowNodes
export function getFlowNodes(data) {
  return request({
    url: '/api/flow/getFlowNodes',
    method: 'get',
    params: data
  }) 
}

