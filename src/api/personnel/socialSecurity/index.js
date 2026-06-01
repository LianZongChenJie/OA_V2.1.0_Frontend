import request from '@/utils/request'

// 社保管理列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/deptChange/list',
    method: 'get',
    params: query
  })
}

// 社保管理详情
export function getDetail(id) {
  return request({
    url: '/personnel/deptChange/detail/' + id,
    method: 'get'
  })
}

// 新增社保管理
export function addDeptChange(data) {
  return request({
    url: '/personnel/deptChange/add',
    method: 'post',
    data: data
  })
}

// 修改社保管理
export function updateDeptChange(data) {
  return request({
    url: '/personnel/deptChange/update',
    method: 'put',
    data: data
  })
}

// 删除社保管理
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/deptChange/delete/' + id,
    method: 'delete'
  })
}
// 执行社保管理
export function executeDeptChange(data) {
  return request({
    url: '/personnel/deptChange/change',
    method: 'put',
    data: data
  })
}

