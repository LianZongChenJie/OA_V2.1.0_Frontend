import request from '@/utils/request'

// 获取奖罚项目分页列表
export function getPageList(query) {
  return request({
    url: '/system/rewardsCate/list',
    method: 'get',
    params: query
  })
}

// 获取奖罚项目详情
export function getDetail(id) {
  return request({
    url: `/system/rewardsCate/${id}`,
    method: 'get'
  })
}

// 新增奖罚项目
export function addenterPrise(data) {
  return request({
    url: '/system/rewardsCate',
    method: 'post',
    data: data
  })
}

// 更新奖罚项目
export function updateenterPrise(data) {
  return request({
    url: `/system/rewardsCate`,
    method: 'put',
    data: data
  })
}


// 修改奖罚项目状态
export function updateStatus(data) {
  return request({
    url: `/basicdata/public/enterprise/changeStatus`,
    method: 'put',
    data: data
  })
}

// 删除奖罚项目接口
export function deletereward(id) {
  return request({
    url: `/system/rewardsCate/${id}`,
    method: 'delete'
  })
}
