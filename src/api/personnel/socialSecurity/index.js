import request from '@/utils/request'

// 社保管理列表分页查询
export function getPageList(query) {
  return request({
    url: '/personnel/social_security/list',
    method: 'get',
    params: query
  })
}

// 社保管理详情
export function getDetail(id) {
  return request({
    url: '/personnel/social_security/detail/' + id,
    method: 'get'
  })
}

// 新增社保管理
export function add(data) {
  return request({
    url: '/personnel/social_security/add',
    method: 'post',
    data: data
  })
}

// 修改社保管理
export function update(data) {
  return request({
    url: '/personnel/social_security/update',
    method: 'put',
    data: data
  })
}

// 删除社保管理
export function del(id) {
  return request({
    url: '/personnel/social_security/delete/' + id,
    method: 'delete'
  })
}

// 社保管理用户列表分页查询
export function getUserPageList(query) {
  return request({
    url: '/personnel/social_security/users/list',
    method: 'get',
    params: query
  })
}

//批量添加社保关联人员
export function addUser(data) {
  return request({
    url: '/personnel/social_security/user/add',
    method: 'post',
    data: data
  })
}
//批量删除社保关联人员
export function delUser(data) {
  return request({
    url: '/personnel/social_security/user/remove',
    method: 'delete',
    data: data
  })
}
//计算快到期的社保管理信息
export function getExpireList(query) {
  return request({
    url: '/personnel/social_security/reminder/expiring',
    method: 'get',
    params: query
  })
}