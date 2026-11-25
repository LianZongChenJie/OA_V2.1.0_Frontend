import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const DEFAULT_PAGE_SIZE = 10

const store = {
  loan: [
    { id: 1001, cost: 12000, checkStatus: 2, balanceCost: 0, balanceStatus: 0, types: 1, planTime: '2026-12-30', adminName: '张三', deptName: '技术部', title: '项目备用金', content: '项目差旅备用金', payStatus: 0, payName: '', payTime: '', backStatus: 0, createTime: '2026-11-20 10:12:00' },
    { id: 1002, cost: 8000, checkStatus: 2, balanceCost: 3000, balanceStatus: 1, types: 2, planTime: '2026-12-31', adminName: '李四', deptName: '市场部', title: '客户拜访借款', content: '客户拜访费用', payStatus: 1, payName: '王财务', payTime: '2026-11-21 15:20:00', backStatus: 0, createTime: '2026-11-19 09:30:00' },
    { id: 1003, cost: 5000, checkStatus: 2, balanceCost: 5000, balanceStatus: 2, types: 1, planTime: '2026-11-30', adminName: '赵六', deptName: '财务部', title: '日常备用金', content: '已全额冲抵', payStatus: 1, payName: '王财务', payTime: '2026-11-18 14:00:00', backStatus: 1, createTime: '2026-11-18 11:00:00' },
    { id: 1004, cost: 20000, checkStatus: 2, balanceCost: 0, balanceStatus: 0, types: 2, planTime: '2027-01-15', adminName: '钱七', deptName: '项目一部', title: '项目预支款', content: '现场采购预支', payStatus: 1, payName: '王财务', payTime: '2026-11-17 16:40:00', backStatus: 0, createTime: '2026-11-17 10:00:00' },
    { id: 1005, cost: 3000, checkStatus: 2, balanceCost: 3000, balanceStatus: 2, types: 1, planTime: '2026-11-20', adminName: '孙八', deptName: '行政部', title: '活动借款', content: '已冲抵无需归还', payStatus: 1, payName: '王财务', payTime: '2026-11-16 11:00:00', backStatus: 0, createTime: '2026-11-16 09:00:00' }
  ],
  expense: [
    { id: 2001, cost: 3200, checkStatus: 2, adminName: '张三', deptName: '技术部', code: 'BX2026112001', expenseTime: '2026-11-18', incomeMonth: '2026-11', createTime: '2026-11-20 10:00:00', payStatus: 0, payName: '', payTime: '' },
    { id: 2002, cost: 1280.5, checkStatus: 2, adminName: '李四', deptName: '市场部', code: 'BX2026111902', expenseTime: '2026-11-17', incomeMonth: '2026-11', createTime: '2026-11-19 11:00:00', payStatus: 1, payName: '王财务', payTime: '2026-11-21 15:00:00' }
  ],
  invoice: [
    { id: 3001, invoiceTitle: '北京示例科技有限公司', amount: 106000, invoiceType: 1, checkStatus: 2, adminName: '张三', enterStatus: 0, openStatus: 1, openName: '王财务', openTime: '2026-11-20', code: 'FP2026112001', createTime: '2026-11-18 10:00:00' },
    { id: 3002, invoiceTitle: '上海示例贸易有限公司', amount: 53000, invoiceType: 2, checkStatus: 2, adminName: '李四', enterStatus: 1, openStatus: 1, openName: '王财务', openTime: '2026-11-19', code: 'FP2026111902', createTime: '2026-11-17 10:00:00' }
  ],
  ticket: [
    { id: 4001, customerName: '广州供应商有限公司', amount: 21200, invoiceType: 1, checkStatus: 2, checkName: '王财务', openStatus: 1, openTime: '2026-11-20', code: 'SP2026112001', payStatus: 0, createTime: '2026-11-18 10:00:00' },
    { id: 4002, customerName: '深圳服务商有限公司', amount: 8800, invoiceType: 2, checkStatus: 2, checkName: '王财务', openStatus: 1, openTime: '2026-11-19', code: 'SP2026111902', payStatus: 1, createTime: '2026-11-17 10:00:00' }
  ],
  income: [
    { id: 5001, amount: 50000, enterTime: '2026-11-21', invoiceId: 3001, invoiceTitle: '北京示例科技有限公司', userName: '张三', deptName: '技术部', createTime: '2026-11-18 10:00:00', remarks: '首笔回款' },
    { id: 5002, amount: 26000, enterTime: '2026-11-22', invoiceId: 3002, invoiceTitle: '上海示例贸易有限公司', userName: '李四', deptName: '市场部', createTime: '2026-11-17 10:00:00', remarks: '部分回款' }
  ],
  payment: [
    { id: 6001, amount: 12000, payTime: '2026-11-21', ticketCode: 'SP2026112001', invoiceTitle: '广州供应商有限公司', adminName: '张三', deptName: '技术部', createTime: '2026-11-18 10:00:00', remarks: '首笔付款' },
    { id: 6002, amount: 8800, payTime: '2026-11-22', ticketCode: 'SP2026111902', invoiceTitle: '深圳服务商有限公司', adminName: '李四', deptName: '市场部', createTime: '2026-11-17 10:00:00', remarks: '已结清' }
  ]
}

const exportFieldMap = {
  loan: { id: 'ID号', cost: '借支金额(元)', payStatus: '打款状态', balanceCost: '已冲抵金额(元)', balanceStatus: '冲抵状态', planTime: '计划归还日期', adminName: '借支员工', deptName: '借支部门', title: '借支理由', payName: '打款人', payTime: '打款确认时间', createTime: '申请时间' },
  expense: { id: 'ID号', cost: '报销总金额(元)', checkStatus: '审批状态', adminName: '报销员工', deptName: '报销部门', code: '报销凭证编号', expenseTime: '原始单据日期', incomeMonth: '入账月份', payStatus: '打款状态' },
  invoice: { id: 'ID号', invoiceTitle: '发票抬头', amount: '发票金额(元)', invoiceType: '开票类型', checkStatus: '审批状态', enterStatus: '回款状态', openStatus: '开票状态', code: '开票号码', createTime: '申请时间' },
  ticket: { id: 'ID号', customerName: '供应商[发票主体]', amount: '发票金额(元)', invoiceType: '开票类型', checkStatus: '审批状态', openStatus: '发票状态', code: '发票号码', payStatus: '付款状态', createTime: '收票时间' },
  income: { id: 'ID号', amount: '回款金额(元)', enterTime: '回款时间', invoiceId: '发票Id', invoiceTitle: '发票抬头', userName: '申请人', deptName: '申请部门', remarks: '备注信息' },
  payment: { id: 'ID号', amount: '付款金额(元)', payTime: '付款时间', ticketCode: '发票编码', invoiceTitle: '发票抬头', adminName: '申请人', deptName: '申请部门', remarks: '备注信息' }
}

const sum = (rows, field) => rows.reduce((total, row) => total + Number(row[field] || 0), 0)

function matchFilter(row, key, value) {
  if (value === '' || value === null || value === undefined) return true
  return String(row[key] ?? '').toLowerCase().includes(String(value).toLowerCase())
}

function filterRows(moduleKey, query = {}) {
  const { pageNum, pageSize, ...filters } = query
  return Object.entries(filters).reduce(
    (rows, [key, value]) => rows.filter((row) => matchFilter(row, key, value)),
    [...(store[moduleKey] || [])]
  )
}

export function getPage(moduleKey, query = {}) {
  const rows = filterRows(moduleKey, query)
  const pageNum = Number(query.pageNum || 1)
  const pageSize = Number(query.pageSize || DEFAULT_PAGE_SIZE)
  const start = (pageNum - 1) * pageSize
  return Promise.resolve({
    code: 200,
    success: true,
    rows: rows.slice(start, start + pageSize),
    total: rows.length
  })
}

export function getSummary(moduleKey, query = {}) {
  const rows = filterRows(moduleKey, query)
  const base = { recordCount: rows.length }
  if (moduleKey === 'loan') {
    return Promise.resolve({ ...base, totalCost: sum(rows, 'cost'), totalBalanceCost: sum(rows, 'balanceCost') })
  }
  if (moduleKey === 'expense') {
    return Promise.resolve({ ...base, totalCost: sum(rows, 'cost'), totalBalanceCost: sum(rows, 'balanceCost'), totalPayAmount: sum(rows, 'payAmount') })
  }
  if (moduleKey === 'invoice') {
    const totalAmount = sum(rows, 'amount')
    const totalEnterAmount = sum(rows, 'enterAmount')
    return Promise.resolve({ ...base, totalAmount, totalEnterAmount, unarrivedAmount: totalAmount - totalEnterAmount })
  }
  if (moduleKey === 'ticket') {
    const totalAmount = sum(rows, 'amount')
    const totalPayAmount = sum(rows, 'payAmount')
    return Promise.resolve({ ...base, totalAmount, totalPayAmount, unpaidAmount: totalAmount - totalPayAmount })
  }
  if (moduleKey === 'income') {
    return Promise.resolve({ ...base, totalAmount: sum(rows, 'amount') })
  }
  if (moduleKey === 'payment') {
    return Promise.resolve({ ...base, totalAmount: sum(rows, 'amount') })
  }
  return Promise.resolve(base)
}

export function getDetail(moduleKey, id) {
  const row = (store[moduleKey] || []).find((item) => Number(item.id) === Number(id))
  return Promise.resolve({ code: 200, data: row || null })
}

function toExcelBlob(moduleKey, query) {
  const rows = filterRows(moduleKey, query)
  const fieldMap = exportFieldMap[moduleKey] || {}
  const sheetData = rows.map((row) => Object.fromEntries(
    Object.entries(fieldMap).map(([field, label]) => [label, row[field] ?? ''])
  ))
  const worksheet = XLSX.utils.json_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '财务统计')
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return Promise.resolve(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

export function exportRows(moduleKey, query = {}) {
  return toExcelBlob(moduleKey, query)
}

export function updateLoan(action, id, payName) {
  const row = store.loan.find((item) => Number(item.id) === Number(id))
  if (!row) return Promise.resolve({ code: 500, msg: '未找到该借支记录' })
  if (action === 'pay') {
    row.payStatus = 1
    row.payName = payName || ''
    row.payTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  if (action === 'back') {
    row.backStatus = 1
  }
  return Promise.resolve({ code: 200, msg: '操作成功' })
}

export default {
  getPage,
  getSummary,
  getDetail,
  exportRows,
  updateLoan
}
