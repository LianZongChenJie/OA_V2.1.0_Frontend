import request from '@/utils/request'
import mock from './mock'

// 后端接口尚未开发时，开发环境默认使用本地 mock。
// 后端就绪后设置 VITE_STAT_MOCK=false，或把此常量改为 false 即可切换真实接口。
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_STAT_MOCK !== 'false'

const resolve = (mockFn, config) => (USE_MOCK ? mockFn() : request(config))

export function getLoanRecordPage(query) {
  return resolve(
    () => mock.getPage('loan', query),
    { url: '/finance/stat/loan/list', method: 'get', params: query }
  )
}

export function getLoanRecordSummary(query) {
  return resolve(
    () => mock.getSummary('loan', query),
    { url: '/finance/stat/loan/summary', method: 'get', params: query }
  )
}

export function getLoanRecordDetail(id) {
  return resolve(
    () => mock.getDetail('loan', id),
    { url: `/finance/stat/loan/detail/${id}`, method: 'get' }
  )
}

export function exportLoanRecord(query) {
  return resolve(
    () => mock.exportRows('loan', query),
    { url: '/finance/stat/loan/export', method: 'get', params: query, responseType: 'blob' }
  )
}

export function markLoanPaid(id, payName) {
  return resolve(
    () => mock.updateLoan('pay', id, payName),
    { url: '/finance/stat/loan/pay', method: 'put', data: { id, payName } }
  )
}

export function markLoanReturned(id) {
  return resolve(
    () => mock.updateLoan('back', id),
    { url: '/finance/stat/loan/back', method: 'put', data: { id } }
  )
}

export function getExpenseRecordPage(query) {
  return resolve(
    () => mock.getPage('expense', query),
    { url: '/finance/stat/expense/list', method: 'get', params: query }
  )
}

export function getExpenseRecordSummary(query) {
  return resolve(
    () => mock.getSummary('expense', query),
    { url: '/finance/stat/expense/summary', method: 'get', params: query }
  )
}

export function getExpenseRecordDetail(id) {
  return resolve(
    () => mock.getDetail('expense', id),
    { url: `/finance/stat/expense/detail/${id}`, method: 'get' }
  )
}

export function exportExpenseRecord(query) {
  return resolve(
    () => mock.exportRows('expense', query),
    { url: '/finance/stat/expense/export', method: 'get', params: query, responseType: 'blob' }
  )
}

export function getInvoiceRecordPage(query) {
  return resolve(
    () => mock.getPage('invoice', query),
    { url: '/finance/stat/invoice/list', method: 'get', params: query }
  )
}

export function getInvoiceRecordSummary(query) {
  return resolve(
    () => mock.getSummary('invoice', query),
    { url: '/finance/stat/invoice/summary', method: 'get', params: query }
  )
}

export function getInvoiceRecordDetail(id) {
  return resolve(
    () => mock.getDetail('invoice', id),
    { url: `/finance/stat/invoice/detail/${id}`, method: 'get' }
  )
}

export function exportInvoiceRecord(query) {
  return resolve(
    () => mock.exportRows('invoice', query),
    { url: '/finance/stat/invoice/export', method: 'get', params: query, responseType: 'blob' }
  )
}

export function getTicketRecordPage(query) {
  return resolve(
    () => mock.getPage('ticket', query),
    { url: '/finance/stat/ticket/list', method: 'get', params: query }
  )
}

export function getTicketRecordSummary(query) {
  return resolve(
    () => mock.getSummary('ticket', query),
    { url: '/finance/stat/ticket/summary', method: 'get', params: query }
  )
}

export function getTicketRecordDetail(id) {
  return resolve(
    () => mock.getDetail('ticket', id),
    { url: `/finance/stat/ticket/detail/${id}`, method: 'get' }
  )
}

export function exportTicketRecord(query) {
  return resolve(
    () => mock.exportRows('ticket', query),
    { url: '/finance/stat/ticket/export', method: 'get', params: query, responseType: 'blob' }
  )
}

export function getIncomeRecordPage(query) {
  return resolve(
    () => mock.getPage('income', query),
    { url: '/finance/stat/income/list', method: 'get', params: query }
  )
}

export function getIncomeRecordSummary(query) {
  return resolve(
    () => mock.getSummary('income', query),
    { url: '/finance/stat/income/summary', method: 'get', params: query }
  )
}

export function getIncomeRecordDetail(id) {
  return resolve(
    () => mock.getDetail('income', id),
    { url: `/finance/stat/income/detail/${id}`, method: 'get' }
  )
}

export function exportIncomeRecord(query) {
  return resolve(
    () => mock.exportRows('income', query),
    { url: '/finance/stat/income/export', method: 'get', params: query, responseType: 'blob' }
  )
}

export function getPaymentRecordPage(query) {
  return resolve(
    () => mock.getPage('payment', query),
    { url: '/finance/stat/payment/list', method: 'get', params: query }
  )
}

export function getPaymentRecordSummary(query) {
  return resolve(
    () => mock.getSummary('payment', query),
    { url: '/finance/stat/payment/summary', method: 'get', params: query }
  )
}

export function getPaymentRecordDetail(id) {
  return resolve(
    () => mock.getDetail('payment', id),
    { url: `/finance/stat/payment/detail/${id}`, method: 'get' }
  )
}

export function exportPaymentRecord(query) {
  return resolve(
    () => mock.exportRows('payment', query),
    { url: '/finance/stat/payment/export', method: 'get', params: query, responseType: 'blob' }
  )
}
