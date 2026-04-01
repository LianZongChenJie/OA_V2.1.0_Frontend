import request from '@/utils/request'

// 获取企业主体分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/public/enterprise/list',
    method: 'get',
    params: query
  })
}

// 获取企业主体详情
export function getDetail(id) {
  return request({
    url: `/basicdata/public/enterprise/detail/${id}`,
    method: 'get'
  })
}

// 新增企业主体
export function addenterPrise(data) {
  return request({
    url: '/basicdata/public/enterprise/add',
    method: 'post',
    data: data
  })
}

// 更新企业主体
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/public/enterprise/update`,
    method: 'put',
    data: data
  })
}


// 修改企业主体状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/public/enterprise/changeStatus`,
    method: 'put',
    data: data
  })
}

