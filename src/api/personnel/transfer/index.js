import request from '@/utils/request'

// 人事调动列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/deptChange/list',
    method: 'get',
    params: query
  })
}

// 人事调动详情
export function getDetail(id) {
  return request({
    url: '/personnel/deptChange/' + id,
    method: 'get'
  })
}

// 新增人事调动
export function addDeptChange(data) {
  return request({
    url: '/personnel/deptChange/add',
    method: 'post',
    data: data
  })
}

// 修改人事调动
export function updateDeptChange(data) {
  return request({
    url: '/personnel/deptChange/update',
    method: 'put',
    data: data
  })
}

// 删除人事调动
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/deptChange/delete/' + id,
    method: 'delete'
  })
}

