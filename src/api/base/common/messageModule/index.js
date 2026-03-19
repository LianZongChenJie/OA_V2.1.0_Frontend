import request from '@/utils/request'

// 获取消息模板分页列表
export function getPageList(query) {
  return request({
    url: '/basicdata/template/list',
    method: 'get',
    params: query
  })
}

// 新增消息模板
export function addMessageModule(data) {
  return request({
    url: '/basicdata/template/add',
    method: 'post',
    data: data
  })
}

// 获取模板详情
export function getMessageModuleDetail(id) {
  return request({
    url: `/basicdata/template/detail/${id}`,
    method: 'get'
  })
}

// 更新模板接口
export function updateMessageModule(data) {
  return request({
    url: '/basicdata/template/update',
    method: 'put',
    data: data
  })
}

// 删除模板接口
export function deleteMessageModule(id) {
  return request({
    url: `/basicdata/template/delete/${id}`,
    method: 'get'
  })
}

