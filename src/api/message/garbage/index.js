import request from '@/utils/request'

// 垃圾箱分页列表
export function getPageList(query) {
  return request({
    url: '/main/message/get_rubbish_list',
    method: 'get',
    params: query
  })
}


// 
export function restore(messageId, table) {
  return request({
    url: '/main/message/restore',
    method: 'put',
    data: {
      messageId: messageId,  
      table: table
    }
  })
}

// 收件箱详情
export function getDetail(id) {
  return request({
    url: '/main/message/receive/read/' + id,
    method: 'get'
  })
}

// 删除 
export function del(messageId, table) {
  const ids = Array.isArray(messageId) ? messageId : [messageId];
  
  return request({
    url: '/main/message/clear',
    method: 'delete',
    data: {
      messageId: messageId,  
      table: table
    }
  })
}