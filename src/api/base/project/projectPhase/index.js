import request from '@/utils/request'

// 获取项目阶段分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/project/step/list',
    method: 'get',
    params: query
  })
}

// 获取项目阶段详情
export function getDetail(id) {
  return request({
    url: `/basicdata/project/step/detail/${id}`,
    method: 'get'
  })
}

// 新增项目阶段
export function addenterPrise(data) {
  return request({
    url: '/basicdata/project/step/add',
    method: 'post',
    data: data
  })
}

// 更新项目阶段
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/project/step/update`,
    method: 'put',
    data: data
  })
}


// 修改项目阶段状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/project/step/changeStatus`,
    method: 'put',
    data: { id, ...data }
  })
}

