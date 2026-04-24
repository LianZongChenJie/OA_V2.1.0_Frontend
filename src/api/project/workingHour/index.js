import request from '@/utils/request'

// 获取工时分页列表
export function getPageList(query) {
  return request({
    url: '/project/task/hour',
    method: 'get',
    params: query
  })
}

// 获取工时详情
export function getDetail(id) {
  return request({
    url: `/project/task/hour/${id}`,
    method: 'get'
  })
}

// 新增工时
export function addenterPrise(data) {
  return request({
    url: '/project/task/hours',
    method: 'post',
    data: data
  })
}

// 更新工时
export function updateenterPrise(data) {
  return request({
    url: `/project/task/hour`,
    method: 'put',
    data: data
  })
}



// 删除工时接口
export function deletereward(id) {
  return request({
    url: `/project/task/hour/${id}`,
    method: 'delete'
  })
}


// // 调整工时
// export function updateChange(data) {
//   return request({
//     url: `/project/task/hour`,
//     method: 'put',
//     data: data
//   })
// }