import request from '@/utils/request'

// 查询服务客户结算分页列表
export function getPageList(query) {
  return request({
    url: '/service/customer/settlement/list',
    method: 'get',
    params: query
  })
}

// 查询服务客户结算详情
export function getDetail(id) {
  return request({
    url: '/service/customer/settlement/detail/' + id,
    method: 'get'
  })
}

// 新增服务客户结算
export function add(data) {
  return request({
    url: '/service/customer/settlement',
    method: 'post',
    data
  })
}

// 编辑服务客户结算
export function edit(data) {
  return request({
    url: '/service/customer/settlement',
    method: 'put',
    data
  })
}

// 删除服务客户结算
export function del(id) {
  return request({
    url: '/service/customer/settlement/' + id,
    method: 'delete'
  })
}

// 下载导入模板
export function getTemplate() {
  return request({
    url: '/service/customer/settlement/template',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入 Excel
export function importXls(data) {
  return request({
    url: '/service/customer/settlement/import',
    method: 'post',
    data
  })
}

// 按当前筛选条件导出 Excel
export function exportXls(query) {
  return request({
    url: '/service/customer/settlement/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
