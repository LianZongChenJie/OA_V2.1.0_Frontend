import request from '@/utils/request'

// 获取任务列表分页列表
export function getPageList(query) {
  return request({
    url: '/project/task/hour',
    method: 'get',
    params: query
  })
}

// 获取任务列表详情
export function getDetail(id) {
  return request({
    url: `/project/task/hour/${id}`,
    method: 'get'
  })
}


// 更新任务列表
export function updateenterPrise(data) {
  return request({
    url: `/project/task/hour`,
    method: 'put',
    data: data
  })
}



// 删除任务列表接口
export function deletereward(id) {
  return request({
    url: `/project/task/hour/${id}`,
    method: 'delete'
  })
}


// 调整工时
export function updateChange(data) {
  return request({
    url: `/project/task/hour`,
    method: 'put',
    data: data
  })
}