import request from '@/utils/request'

// 获取销售合同归档分页列表
export function getContractPageList(query) {
  return request({
    url: '/system/contract/archivelist',
    method: 'get',
    params: query
  })
}

// 获取采购合同归档分页列表
export function getPurchasePageList(query) {
  return request({
    url: '/system/purchase/archive/list',
    method: 'get',
    params: query
  })
}