import request from '@/utils/request'

// 获取全国省市树形结构（根节点）
export function getThreeList(query) {
  return request({
    url: '/basicdata/public/area/tree',
    method: 'get',
    params: query
  })
}

// 获取子节点（懒加载用）
export function getThreeListByPid(query) {
  return request({
    url: '/basicdata/public/area/tree',
    method: 'get',
    params: query
  })
}

// 导出区域数据
export function exportAreaData(level) {
  return request({
    url: '/basicdata/public/area/getDataByLevel/'+level,
    method: 'get',
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/basicdata/public/area/add',
    method: 'post',
    data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/basicdata/public/area/update',
    method: 'put',
    data
  })
}

// 修改区域状态
export function delArea(data) {
  return request({
    url: '/basicdata/public/changeStatus/',
    method: 'put',
    data
  })
}
