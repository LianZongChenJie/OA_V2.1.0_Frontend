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
