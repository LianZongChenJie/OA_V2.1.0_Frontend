import request from '@/utils/request'

// 获取资产分类分页列表
export function getPageList(query) {
  return request({
    url: '/system/propertyCate/list',
    method: 'get',
    params: query
  })
}

// 新增/修改资产分类
export function addAssetClassify(data) {
  return request({
    url: '/system/propertyCate',
    method: 'post',
    data
  })
}

// 删除资产分类
export function deleteAssetClassify(id) {
  return request({
    url: '/system/propertyCate/' + id,
    method: 'delete'
  })
}

// 获取资产分类树形结构
export function getTree(query) {
  return request({
    url: '/system/propertyCate/tree',
    method: 'get',
    params: query
  })
}
