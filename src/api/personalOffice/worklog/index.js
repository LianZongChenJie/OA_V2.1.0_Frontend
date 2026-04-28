import request from '@/utils/request'

// 工作记录分页列表
export function getPageList(query) {
  return request({
    url: '/dashboard/schedule/list',
    method: 'get',
    params: query
  })
}

// 工作记录详情
export function getDetail(id) {
  return request({
    url: '/dashboard/schedule/detail/' + id,
    method: 'get'
  })
}

// 工作记录新增
export function add(data) {
  return request({
    url: '/dashboard/schedule/add',
    method: 'post',
    data
  })
} 

// 工作记录更新
export function edit(data) {
  return request({
    url: '/dashboard/schedule/update',
    method: 'put',
    data
  })
}

// 工作记录删除
export function del(id) {
  return request({
    url: '/dashboard/schedule/delete/' + id,
    method: 'delete'
  })
}


// 获取工作类型
export function getWorkCateList(params) {
  return request({
    url: '/basicdata/project/workCate/list',
    method: 'get',
    params
  })
}