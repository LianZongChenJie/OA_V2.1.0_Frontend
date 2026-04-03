import request from '@/utils/request'

// 获取产品分类分页列表
export function getPageList(query) {
  return request({
    url: '/system/productCate/list',
    method: 'get',
    params: query
  })
}

// 新增产品分类
export function addClassify(data) {
  return request({
    url: '/system/productCate',
    method: 'post',
    data
  })
}
//修改产品分类
export function updateClassify(data) {
  return request({
    url: '/system/productCate',
    method: 'put',
    data
  })
}


// 删除产品分类
export function deleteClassify(id) {
  return request({
    url: '/system/productCate/' + id,
    method: 'delete'
  })
}

// 获取产品分类树形结构
export function getTree(query) {
  return request({
    url: '/system/productCate/tree',
    method: 'get',
    params: query
  })
}

