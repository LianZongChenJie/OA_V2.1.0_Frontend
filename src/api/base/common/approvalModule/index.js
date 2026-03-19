import request from '@/utils/request'

// 获取审批模块分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/flowModule/list',
    method: 'get',
    params: query
  })
}

// 获取审批模块详情
export function getDetail(id) {
  return request({
    url: `/basicdata/flowModule/detail/${id}`,
    method: 'get'
  })
}

// 新增审批模块
export function addMessageModule(data) {
  return request({
    url: '/basicdata/flowModule/add',
    method: 'post',
    data: data
  })
}

// 更新审批模块接口
export function updateMessageModule(data) {
  return request({
    url: `/basicdata/flowModule/update`,
    method: 'put',
    data: data
  })
}

// 删除审批模块接口
export function deleteMessageModule(id) {
  return request({
    url: `/basicdata/flowModule/delete/${id}`,
    method: 'delete'
  })
}

