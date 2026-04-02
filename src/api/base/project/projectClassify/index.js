import request from '@/utils/request'

// 获取项目分类分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/project/cate/list',
    method: 'get',
    params: query
  })
}

// 获取项目分类详情
export function getDetail(id) {
  return request({
    url: `/basicdata/project/cate/detail/${id}`,
    method: 'get'
  })
}

// 新增项目分类
export function addenterPrise(data) {
  return request({
    url: '/basicdata/project/cate/add',
    method: 'post',
    data: data
  })
}

// 更新项目分类
export function updateenterPrise(data) {
  return request({
    url: `/basicdata/project/cate/update`,
    method: 'put',
    data: data
  })
}


// 修改项目分类状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/project/step/changeStatus`,
    method: 'put',
    data: { id, ...data }
  })
}

