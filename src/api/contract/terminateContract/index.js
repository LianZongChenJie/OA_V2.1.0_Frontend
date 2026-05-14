import request from '@/utils/request'

// 获取销售合同终止分页列表
export function getContractPageList(query) {
  return request({
    url: '/system/contract/stoplist',
    method: 'get',
    params: query
  })
}

// 获取采购合同终止分页列表
export function getPurchasePageList(query) {
  return request({
    url: '/system/purchase/stop/list',
    method: 'get',
    params: query
  })
}