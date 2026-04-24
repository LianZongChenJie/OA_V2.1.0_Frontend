import request from '@/utils/request'

// 获取开票管理分页列表
export function getPageList(query) {
  return request({
    url: '/finance/invoice/list',
    method: 'get',
    params: query
  })
}

// 获取开票管理详情
export function getDetail(id) {
  return request({
    url: '/finance/invoice/detail/' + id,
    method: 'get'
  })  
}

// 新增开票管理
export function add(data) {
  return request({
    url: '/finance/invoice/add',
    method: 'post',
    data
  })
}

// 修改开票管理
export function update(data) {
   return request({
    url: '/finance/invoice/add',
    method: 'put',
    data
  })
}
 
// 删除开票管理
export function del(ids) {
  return request({
    url: '/finance/invoice/delete/' + ids,
    method: 'delete'
  })
}

// 更新发票开票状态
export function updateStatus(data) {
  return request({
    url: '/finance/invoice/openStatus',
    method: 'put',
    data
  })
}
