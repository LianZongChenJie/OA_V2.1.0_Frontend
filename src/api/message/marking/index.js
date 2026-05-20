import request from '@/utils/request'

// 星标信息分页列表
export function getPageList(query) {
  return request({
    url: '/main/message/receive/get_list',
    method: 'get',
    params: {
      ...query,
      isStar: 1
    }
  })
}


// 星标信息详情
export function getDetail(messageId) {
  return request({
    url: '/main/message/receive/read',
    method: 'put',
    data: {
      messageId: messageId
    }
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

// 批量设置星标状态
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