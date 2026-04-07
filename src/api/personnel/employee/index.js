import request from '@/utils/request'

// 企业员工分页列表
export function getPageList(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 企业员工详情
export function getDetail(id) {
  return request({
    url: '/system/user/' + id,
    method: 'get'
  })
}

// 新增企业员工
export function addEmployee(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

// 修改企业员工
export function updateEmployee(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

// 删除企业员工
export function deleteEmployee(id) {
  return request({
    url: '/system/user/' + id,
    method: 'delete'
  })
}

// 导出企业员工
export function exportEmployee(query) {
  return request({
    url: '/system/user/export',
    method: 'post',
    params: query,
    responseType: 'blob'
  })
}

// 导入企业员工
export function importEmployee(data) {
  return request({
    url: '/system/user/import', 
    method: 'post',
    data
  })
}

// 修改/重置密码
export function resetPassword(data) {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data
  })  
}

