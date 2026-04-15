import request from '@/utils/request'

// 获取项目列表分页列表
export function getPageList(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

// 获取项目列表详情
export function getDetail(id) {
  return request({
    url: `/system/contract/${id}`,
    method: 'get'
  })
}

// 新增项目列表
export function addenterPrise(data) {
  return request({
    url: '/project',
    method: 'post',
    data: data
  })
}

// 更新项目列表
export function updateenterPrise(data) {
  return request({
    url: `/project`,
    method: 'put',
    data: data
  })
}



// 删除项目列表接口
export function deletereward(id) {
  return request({
    url: `/project/${id}`,
    method: 'delete'
  })
}
