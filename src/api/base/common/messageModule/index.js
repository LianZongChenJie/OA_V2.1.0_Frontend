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
    url: '/basicdata/template',
    method: 'post',
    data: data
  })
} 
