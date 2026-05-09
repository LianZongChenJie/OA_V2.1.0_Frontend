import request from '@/utils/request'

// 发件箱分页列表
export function getPageList(query) {
  return request({
    url: '/main/message/send/get_list',
    method: 'get',
    params: {
      ...query,
      isDraft: 1
    }
  })
}

// 发件箱详情
export function getDetail(id) {
  return request({
    url: '/main/message/send/get_detail/' + id,
    method: 'get'
  })
}

// 新增发件
export function add(data) {
  return request({
    url: '/main/message/send/add',
    method: 'post',
    data
  })
}

// 草稿发送
export function put(data) {
  return request({
    url: '/main/message/send',
    method: 'put',
    data
  })
}

// 删除 
export function del(messageIds, table) {
  const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
  
  return request({
    url: '/main/message/delete',
    method: 'delete',
    data: {
      messageIds: ids,  
      table: table
    }
  })
}