import request from '@/utils/request'

// 查询月度项目台账分页列表
export function getPageList(query) {
  return request({
    url: '/project/monthly/list',
    method: 'get',
    params: query
  })
}

// 查询月度项目台账详情
export function getDetail(id) {
  return request({
    url: '/project/monthly/detail/' + id,
    method: 'get'
  })
}

// 新增月度项目台账
export function add(data) {
  return request({
    url: '/project/monthly',
    method: 'post',
    data
  })
}

// 编辑月度项目台账
export function edit(data) {
  return request({
    url: '/project/monthly',
    method: 'put',
    data
  })
}

// 删除月度项目台账
export function del(id) {
  return request({
    url: '/project/monthly/' + id,
    method: 'delete'
  })
}

// 下载导入模板
export function getTemplate() {
  return request({
    url: '/project/monthly/template',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入 Excel
export function importXls(data) {
  return request({
    url: '/project/monthly/import',
    method: 'post',
    data
  })
}

// 按当前筛选条件导出 Excel
export function exportXls(query) {
  return request({
    url: '/project/monthly/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
