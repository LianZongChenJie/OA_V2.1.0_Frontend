import request from '@/utils/request'

// 获取工作类别分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/project/workCate/list',
    method: 'get',
    params: query
  })
}

// 获取工作类别详情
export function getDetail(id) {
  return request({
    url: `/basicdata/project/workCate/detail/${id}`,
    method: 'get'
  })
}

// 新增工作类别
export function addenterPrise(data) {
  return request({
    url: '/basicdata/project/workCate/add',
    method: 'post',
    data: data
  })
}

// 更新工作类别
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/project/workCate/update`,
    method: 'put',
    data: data
  })
}


// 修改工作类别状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/project/workCate/changeStatus`, 
    method: 'put',
    data: { id, ...data }
  })
}

