import request from '@/utils/request'

// 收件箱分页列表
export function getPageList(query) {
  return request({
    url: '/main/message/receive/get_list',
    method: 'get',
    params: query
  })
}

// 收件箱详情
export function getDetail(messageId) {
  return request({
    url: '/main/message/receive/read',
    method: 'put',
    data: {
      messageId: messageId
    }
  })
}

// 标记已读
export function setRead(messageIds) {
  const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
  return request({
    url: '/main/message/receive/set_reads',
    method: 'put',
    data: {
      messageIds: ids
    }
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
export function sendDraft(data) {
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

// 批量设为星标
export function setStar(messageIds, isStar) {
  const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
  return request({
    url: '/main/message/receive/set_stars',
    method: 'put',
    data: {
      messageIds: ids,
      isStar: isStar  
    }
  })
}