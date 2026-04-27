import request from '@/utils/request'

// 回款记录分页列表
export function getPageList(query) {
  return request({
    url: '/finance/invoice/income/detail',
    method: 'get',
    params: query
  })
}

// 新增回款记录
export function add(data) {
  return request({
    url: '/finance/invoice/add_income',
    method: 'post',
    data
  })
}

// 删除回款记录
export function del(ids) {
  return request({
    url: '/finance/invoice/delete_income',
    method: 'delete',
    params: { ids }
  })
}