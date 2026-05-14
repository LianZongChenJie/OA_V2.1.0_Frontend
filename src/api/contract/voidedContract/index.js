import request from '@/utils/request'

// 获取销售合同作废分页列表
export function getContractPageList(query) {
  return request({
    url: '/system/contract/voidlist',
    method: 'get',
    params: query
  })
}

// 获取采购合同作废分页列表
export function getPurchasePageList(query) {
  return request({
    url: '/system/purchase/void/list',
    method: 'get',
    params: query
  })
}