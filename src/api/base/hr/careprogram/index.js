import request from '@/utils/request'

// 获取关怀项目分页列表
export function getPageList(query) {
  return request({
    url: '/system/careCate/list',
    method: 'get',
    params: query
  })
}

// 获取关怀项目详情
export function getDetail(id) {
  return request({
    url: `/system/careCate/${id}`,
    method: 'get'
  })
}

// 新增关怀项目
export function addenterPrise(data) {
  return request({
    url: '/system/careCate',
    method: 'post',
    data: data
  })
}

// 更新关怀项目
export function updateenterPrise(data) {
  return request({
    url: `/system/careCate`,
    method: 'put',
    data: data
  })
}


// 修改关怀项目状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/public/enterprise/changeStatus`,
    method: 'put',
    data: data
  })
}

// 删除关怀项目接口
export function deletereward(id) {
  return request({
    url: `/system/careCate/${id}`,
    method: 'delete'
  })
}
