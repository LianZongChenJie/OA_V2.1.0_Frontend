import request from '@/utils/request'

// 员工合同列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/contract/list',
    method: 'get',
    params: query
  })
}

// 员工合同详情
export function getDetail(id) {
  return request({
    url: '/personnel/contract/detail/' + id,
    method: 'get'
  })
}

// 新增员工合同
export function addDeptChange(data) {
  return request({
    url: '/personnel/contract/add',
    method: 'post',
    data: data
  })
}

// 修改员工合同
export function updateDeptChange(data) {
  return request({
    url: '/personnel/contract/update',
    method: 'put',
    data: data
  })
}

// 删除员工合同
export function deleteDeptChange(id) {
  return request({
    url: '/personnel/contract/delete/' + id,
    method: 'delete'
  })
}

