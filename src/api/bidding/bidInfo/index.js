import request from '@/utils/request'

// 招投标信息分页列表
export function getPageList(query) {
  return request({
    url: '/tender/list',
    method: 'get',
    params: query
  })
}
// 招投标信息详情
export function getDetail(id) {
  return request({
    url: `/tender/${id}`,
    method: 'get'
  })
}
// 招投标信息新增
export function add(data) {
  return request({
    url: '/tenderadd',
    method: 'post',
    data
  })
}
// 招投标信息修改
export function edit(data) {
  return request({
    url: '/tenderupd',
    method: 'post',
    data
  })
}
// 删除招投标信息
export function del(id) {
  return request({
    url: `/tender/${id}`,
    method: 'delete'
  })
}

// 招投标信息倒入模版下载
export function downloadTmp(id) {
  return request({
    url: `/tender/import/template`,
    method: 'get'
  })
}
// 招投标信息导入
export function importData(data) {
  return request({
    url: `/tender/import`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 招投标信息导出
export function exportData(query) {
  return request({
    url: `/tender/export`,
    method: 'get',
    params: query
  })
}
//
