import request from '@/utils/request'

// 获取文档列表分页列表
export function getPageList(query) {
  return request({
    url: '/project/document/list',
    method: 'get',
    params: query
  })
}

// 获取文档列表详情
export function getDetail(id) {
  return request({
    url: `/project/document/${id}`,
    method: 'get'
  })
}

// 新增文档列表
export function addenterPrise(data) {
  return request({
    url: '/project/document',
    method: 'post',
    data: data
  })
}

// 更新文档列表
export function updateenterPrise(data) {
  return request({
    url: `/project/document`,
    method: 'put',
    data: data
  })
}



// 删除文档列表接口
export function deletereward(id) {
  return request({
    url: `/project/document/${id}`,
    method: 'delete'
  })
}

// 获取工作类型（项目分类）列表
export function getWorkCateList(params) {
  return request({
    url: '/basicdata/project/workCate/list',
    method: 'get',
    params
  })
}
