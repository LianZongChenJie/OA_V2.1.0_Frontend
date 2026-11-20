import request from '@/utils/request'

export function getPageList(query) {
  return request({ url: '/hr/cost/list', method: 'get', params: query })
}

export function getDetail(id) {
  return request({ url: '/hr/cost/detail/' + id, method: 'get' })
}

export function add(data) {
  return request({ url: '/hr/cost', method: 'post', data })
}

export function edit(data) {
  return request({ url: '/hr/cost', method: 'put', data })
}

export function del(id) {
  return request({ url: '/hr/cost/' + id, method: 'delete' })
}

export function getTemplate() {
  return request({ url: '/hr/cost/template', method: 'get', responseType: 'blob' })
}

export function importXls(data) {
  return request({ url: '/hr/cost/import', method: 'post', data })
}

export function exportXls(query) {
  return request({ url: '/hr/cost/export', method: 'get', params: query, responseType: 'blob' })
}

export function getOrgSummary(query) {
  return request({ url: '/hr/cost/summary/org', method: 'get', params: query })
}

export function getCitySummary(query) {
  return request({ url: '/hr/cost/summary/city', method: 'get', params: query })
}

export function exportOrgSummary(query) {
  return request({ url: '/hr/cost/summary/org/export', method: 'get', params: query, responseType: 'blob' })
}

export function exportCitySummary(query) {
  return request({ url: '/hr/cost/summary/city/export', method: 'get', params: query, responseType: 'blob' })
}

export function getFilterOptions() {
  return request({ url: '/hr/cost/filter/options', method: 'get' })
}
