import request from '@/utils/request'

// 获取任务列表分页列表
export function getPageList(query) {
  return request({
    url: '/project/task/list',
    method: 'get',
    params: query
  })
}

// 获取任务列表详情
export function getDetail(id) {
  return request({
    url: `/project/task/${id}`,
    method: 'get'
  })
}

// 新增任务列表
export function addenterPrise(data) {
  return request({
    url: '/project/task',
    method: 'post',
    data: data
  })
}

// 更新任务列表
export function updateenterPrise(data) {
  return request({
    url: `/project/task`,
    method: 'put',
    data: data
  })
}



// 删除任务列表接口
export function deletereward(id) {
  return request({
    url: `/project/task/${id}`,
    method: 'delete'
  })
}
