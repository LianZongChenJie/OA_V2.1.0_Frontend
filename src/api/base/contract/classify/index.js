import request from '@/utils/request'

// 获取合同分类分页列表
export function getPageList(query) {
  return request({
    url: '/system/contractCate/list',
    method: 'get',
    params: query
  })
}

// 获取合同分类详情
export function getDetail(id) {
  return request({
    url: `/basicdata/customer/industry/detail/${id}`,
    method: 'get'
  })
}

// 新增合同分类
export function addenterPrise(data) {
  return request({
    url: '/system/contractCate',
    method: 'post',
    data: data
  })
}

// 更新合同分类
export function updateenterPrise(data) {
  return request({
    url: `/system/contractCate`,
    method: 'put',
    data: data
  })
}


// 修改合同分类状态
export function updateStatus(id,data) {
  return request({
    url: `/basicdata/customer/industry/changeStatus`, 
    method: 'put',
    data: { id, ...data }
  })
}

