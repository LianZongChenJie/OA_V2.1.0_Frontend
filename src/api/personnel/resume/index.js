import request from '@/utils/request'

// 简历列表分页查询
export function getPageList(query) {
  return request({
    url: '/resume/list',
    method: 'get',
    params: query
  })
}

// 简历详情
export function getDetail(id) {
  return request({
    url: '/resume/' + id,
    method: 'get'
  })
}

// 新增简历
export function add(data) {
  return request({
    url: '/resume/add',
    method: 'post',
    data: data
  })
}

// 修改简历
export function update(data) {
  return request({
    url: '/resume/upd',
    method: 'post',
    data: data
  })
}

// 删除简历
export function del(id) {
  return request({
    url: '/resume/' + id,
    method: 'delete'
  })
}

// 更新面试状态
export function updateInterviewResult(data) {
  return request({
    url: '/resume/interview',
    method: 'POST',
    data: data
  })
}

// 确认入职
export function resumeEntry(data) {
  return request({
    url: '/resume/entry',
    method: 'POST',
    data
  })
}