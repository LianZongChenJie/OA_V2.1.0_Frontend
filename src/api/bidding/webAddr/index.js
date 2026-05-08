import request from '@/utils/request'

// 招投标网址分页列表
export function getPageList(query) {
  return request({
    url: '/websiteaccount/list',
    method: 'get',
    params: query
  })
}
// 招投标网址详情
export function getDetail(id) {
  return request({
    url: `/websiteaccount/${id}`,
    method: 'get'
  })
}
// 招投标网址新增
export function addWebsiteAccount(data) {
  return request({
    url: '/websiteaccount',
    method: 'post',
    data
  })
}
// 招投标网址修改
export function updateWebsiteAccount(data) {
  return request({
    url: `/websiteaccount`,
    method: 'put',
    data
  })
}
// 招投标网址删除
export function deleteWebsiteAccount(id) {
  return request({
    url: `/websiteaccount/${id}`,
    method: 'delete'
  })
}
// 招投标网址导入
export function importWebsiteAccount(data) {
  return request({
    url: `/websiteaccount/import`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 招投标导入模版下载
export function downloadWebsiteAccount() {
  return request({
    url: `/websiteaccount/import/template`,
    method: 'get'
  })
}
