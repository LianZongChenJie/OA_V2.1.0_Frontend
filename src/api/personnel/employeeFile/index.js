import request from '@/utils/request'

// 获取常规数据分页列表
export function getPageList(query) {
  return request({
    url: '/system/basicUser/list',
    method: 'get',
    params: query
  })
}


