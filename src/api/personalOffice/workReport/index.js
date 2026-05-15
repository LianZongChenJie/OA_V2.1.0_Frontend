import request from '@/utils/request'

// 获取工作汇报分页列表
export function getPageList(query) {
  return request({
    url: '/oa/work/list',
    method: 'get',
    params: query
  })
}

// 获取工作汇报详情
export function getDetail(id) {
  return request({
    url: `/oa/work/view/${id}`,
    method: 'get'
  })
}

// 新增工作汇报
export function addenterPrise(data) {
  return request({
    url: '/oa/work/add',
    method: 'post',
    data: data
  })
}

// 更新工作汇报
export function updateenterPrise(data) {
  return request({
    url: `/oa/work/add`,
    method: 'post',
    data: data
  })
}


// 删除工作汇报接口
export function deleteenterPrise(id) {
  return request({
    url: `/oa/work/del/${id}`,
    method: 'delete'
  })
}

