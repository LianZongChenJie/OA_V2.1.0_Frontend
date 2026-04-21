import request from '@/utils/request'

// 奖罚管理列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/rewards/list',
    method: 'get',
    params: query
  })
}

// 奖罚管理详情
export function getDetail(id) {
  return request({
    url: '/personnel/rewards/detail/' + id,
    method: 'get'
  })
}

// 新增奖罚管理
export function addDeptChange(data) {
  return request({
    url: '/personnel/rewards/add',
    method: 'post',
    data: data
  })
}

// 修改奖罚管理
export function updateDeptChange(data) {
  return request({
    url: '/personnel/rewards/update',
    method: 'put',
    data: data
  })
}

// 删除奖罚管理
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/rewards/delete/' + id,
    method: 'delete'
  })
}

