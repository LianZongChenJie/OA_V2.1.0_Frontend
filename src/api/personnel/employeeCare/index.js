import request from '@/utils/request'

// 员工关怀列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/care/list',
    method: 'get',
    params: query
  })
}

// 员工关怀详情
export function getDetail(id) {
  return request({
    url: '/personnel/care/detail/' + id,
    method: 'get'
  })
}

// 新增员工关怀
export function addDeptChange(data) {
  return request({
    url: '/personnel/care/add',
    method: 'post',
    data: data
  })
}

// 修改员工关怀
export function updateDeptChange(data) {
  return request({
    url: '/personnel/care/update',
    method: 'put',
    data: data
  })
}

// 删除员工关怀
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/care/delete/' + id,
    method: 'delete'
  })
}

