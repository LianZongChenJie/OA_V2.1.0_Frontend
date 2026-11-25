import { listUser } from '@/api/system/user.js'

const dateOnly = (value) => value?.split(' ')[0] || ''
const dateTime = (value) => value || ''
const money = (value) => (value === null || value === undefined || value === '' ? '' : Number(value).toFixed(2))

const userSearch = (label, order = 1) => ({
  type: 'selectApi',
  searchParam: 'nickName',
  api: listUser,
  optionValue: 'userId',
  optionLabel: 'nickName',
  fieldName: 'adminId',
  placeholder: `请选择${label}`,
  label,
  order
})

export const statConfig = {
  loan: {
    title: '借支记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, minWidth: 80, align: 'center' },
      { fieldName: 'cost', label: '借支金额(元)', width: 130, minWidth: 110, align: 'right', format: money },
      { fieldName: 'payStatus', label: '打款状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'cash_pay_status', fieldName: 'payStatus', placeholder: '请选择打款状态', label: '打款状态', order: 1 } },
      { fieldName: 'balanceCost', label: '已冲抵金额(元)', width: 140, minWidth: 110, align: 'right', format: money },
      { fieldName: 'balanceStatus', label: '冲抵状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'balance_status', fieldName: 'balanceStatus', placeholder: '请选择冲抵状态', label: '冲抵状态', order: 2 } },
      { fieldName: 'types', label: '借支类型', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'cash_advance_types', fieldName: 'types', placeholder: '请选择借支类型', label: '借支类型', order: 3 } },
      { fieldName: 'planTime', label: '计划归还日期', width: 220, minWidth: 200 },
      { fieldName: 'adminName', label: '借支员工', width: 110, searchable: userSearch('借支员工', 4) },
      { fieldName: 'deptName', label: '借支部门', width: 110 },
      { fieldName: 'title', label: '借支理由', minWidth: 180 },
      { fieldName: 'payName', label: '打款人', width: 100 },
      { fieldName: 'payTime', label: '打款确认时间', width: 170, format: dateTime },
      { fieldName: 'createTime', label: '申请时间', width: 170, format: dateTime }
    ],
    dictMap: {
      checkStatus: 'check_status',
      balanceStatus: 'balance_status',
      types: 'cash_advance_types',
      payStatus: 'cash_pay_status',
      backStatus: 'cash_back_status'
    },
    detailFields: [
      { label: '借支编号', fieldName: 'id' },
      { label: '借支主题', fieldName: 'title' },
      { label: '借支金额(元)', fieldName: 'cost', format: money },
      { label: '借支员工', fieldName: 'adminName' },
      { label: '借支部门', fieldName: 'deptName' },
      { label: '借支类型', fieldName: 'types', dictKey: 'cash_advance_types' },
      { label: '审批状态', fieldName: 'checkStatus', dictKey: 'check_status' },
      { label: '已冲抵金额(元)', fieldName: 'balanceCost', format: money },
      { label: '冲抵状态', fieldName: 'balanceStatus', dictKey: 'balance_status' },
      { label: '计划归还日期', fieldName: 'planTime' },
      { label: '打款状态', fieldName: 'payStatus', dictKey: 'cash_pay_status' },
      { label: '打款人', fieldName: 'payName' },
      { label: '打款确认时间', fieldName: 'payTime' },
      { label: '还款状态', fieldName: 'backStatus', dictKey: 'cash_back_status' },
      { label: '借支理由', fieldName: 'content', span: 2 },
      { label: '申请时间', fieldName: 'createTime' }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '借支总额(元)', fieldName: 'totalCost', type: 'money' },
      { label: '已冲抵金额(元)', fieldName: 'totalBalanceCost', type: 'money' }
    ]
  },
  expense: {
    title: '报销记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, align: 'center' },
      { fieldName: 'cost', label: '报销总金额(元)', width: 140, align: 'right', format: money },
      { fieldName: 'checkStatus', label: '审批状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'check_status', fieldName: 'checkStatus', placeholder: '请选择审批状态', label: '审批状态', order: 1 } },
      { fieldName: 'adminName', label: '报销员工', width: 110, searchable: userSearch('报销员工', 2) },
      { fieldName: 'deptName', label: '报销部门', width: 110 },
      { fieldName: 'code', label: '报销凭证编号', width: 150, searchable: { type: 'input', fieldName: 'code', placeholder: '请输入报销凭证编号', label: '报销凭证编号', order: 3 } },
      { fieldName: 'expenseTime', label: '原始单据日期', width: 130, format: dateOnly },
      { fieldName: 'incomeMonth', label: '入账月份', width: 110 },
      { fieldName: 'createTime', label: '录入时间', width: 170, format: dateTime },
      { fieldName: 'payStatus', label: '打款状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'cash_pay_status', fieldName: 'payStatus', placeholder: '请选择打款状态', label: '打款状态', order: 4 } },
      { fieldName: 'payName', label: '打款人', width: 100 },
      { fieldName: 'payTime', label: '打款时间', width: 160, format: dateOnly }
    ],
    dictMap: { checkStatus: 'check_status', payStatus: 'cash_pay_status' },
    detailFields: [
      { label: '编号', fieldName: 'id' },
      { label: '报销总金额(元)', fieldName: 'cost', format: money },
      { label: '报销凭证编号', fieldName: 'code' },
      { label: '报销员工', fieldName: 'adminName' },
      { label: '报销部门', fieldName: 'deptName' },
      { label: '审批状态', fieldName: 'checkStatus', dictKey: 'check_status' },
      { label: '原始单据日期', fieldName: 'expenseTime' },
      { label: '入账月份', fieldName: 'incomeMonth' },
      { label: '打款状态', fieldName: 'payStatus', dictKey: 'cash_pay_status' },
      { label: '打款人', fieldName: 'payName' },
      { label: '打款时间', fieldName: 'payTime' },
      { label: '录入时间', fieldName: 'createTime' }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '报销总额(元)', fieldName: 'totalCost', type: 'money' },
      { label: '已冲抵金额(元)', fieldName: 'totalBalanceCost', type: 'money' },
      { label: '需打款金额(元)', fieldName: 'totalPayAmount', type: 'money' }
    ]
  },
  invoice: {
    title: '开票记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, align: 'center' },
      { fieldName: 'invoiceTitle', label: '发票抬头', minWidth: 200 },
      { fieldName: 'amount', label: '发票金额(元)', width: 130, align: 'right', format: money },
      { fieldName: 'invoiceType', label: '开票类型', width: 110, align: 'center', searchable: { type: 'select', dictKey: 'invoice_type', fieldName: 'invoiceType', placeholder: '请选择开票类型', label: '开票类型', order: 1 } },
      { fieldName: 'checkStatus', label: '审批状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'check_status', fieldName: 'checkStatus', placeholder: '请选择审批状态', label: '审批状态', order: 2 } },
      { fieldName: 'adminName', label: '申请员工', width: 110, searchable: userSearch('申请员工', 3) },
      { fieldName: 'enterStatus', label: '回款状态', width: 110, align: 'center', searchable: { type: 'select', dictKey: 'enter_status', fieldName: 'enterStatus', placeholder: '请选择回款状态', label: '回款状态', order: 4 } },
      { fieldName: 'openStatus', label: '开票状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'open_status', fieldName: 'openStatus', placeholder: '请选择开票状态', label: '开票状态', order: 5 } },
      { fieldName: 'openName', label: '开票人', width: 100 },
      { fieldName: 'openTime', label: '开票日期', width: 130, format: dateOnly },
      { fieldName: 'code', label: '开票号码', width: 150 },
      { fieldName: 'createTime', label: '申请时间', width: 170, format: dateTime }
    ],
    dictMap: { invoiceType: 'invoice_type', checkStatus: 'check_status', enterStatus: 'enter_status', openStatus: 'open_status' },
    detailFields: [
      { label: '编号', fieldName: 'id' },
      { label: '发票抬头', fieldName: 'invoiceTitle', span: 2 },
      { label: '发票金额(元)', fieldName: 'amount', format: money },
      { label: '开票类型', fieldName: 'invoiceType', dictKey: 'invoice_type' },
      { label: '审批状态', fieldName: 'checkStatus', dictKey: 'check_status' },
      { label: '申请员工', fieldName: 'adminName' },
      { label: '回款状态', fieldName: 'enterStatus', dictKey: 'enter_status' },
      { label: '开票状态', fieldName: 'openStatus', dictKey: 'open_status' },
      { label: '开票人', fieldName: 'openName' },
      { label: '开票日期', fieldName: 'openTime' },
      { label: '开票号码', fieldName: 'code' },
      { label: '申请时间', fieldName: 'createTime' }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '发票金额(元)', fieldName: 'totalAmount', type: 'money' },
      { label: '已到账金额(元)', fieldName: 'totalEnterAmount', type: 'money' },
      { label: '未到账金额(元)', fieldName: 'unarrivedAmount', type: 'money' }
    ]
  },
  ticket: {
    title: '收票记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, align: 'center' },
      { fieldName: 'customerName', label: '供应商[发票主体]', minWidth: 200 },
      { fieldName: 'amount', label: '发票金额(元)', width: 130, align: 'right', format: money },
      { fieldName: 'invoiceType', label: '开票类型', width: 110, align: 'center', searchable: { type: 'select', dictKey: 'invoice_type', fieldName: 'invoiceType', placeholder: '请选择开票类型', label: '开票类型', order: 1 } },
      { fieldName: 'checkStatus', label: '审批状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'check_status', fieldName: 'checkStatus', placeholder: '请选择审批状态', label: '审批状态', order: 2 } },
      { fieldName: 'checkName', label: '当前审核人', width: 110 },
      { fieldName: 'openStatus', label: '发票状态', width: 100, align: 'center', searchable: { type: 'select', dictKey: 'open_status', fieldName: 'openStatus', placeholder: '请选择发票状态', label: '发票状态', order: 3 } },
      { fieldName: 'openTime', label: '收票时间', width: 130, format: dateOnly },
      { fieldName: 'code', label: '发票号码', width: 150 },
      { fieldName: 'payStatus', label: '付款状态', width: 110, align: 'center' },
      { fieldName: 'createTime', label: '录入时间', width: 170, format: dateTime }
    ],
    dictMap: { invoiceType: 'invoice_type', checkStatus: 'check_status', openStatus: 'open_status', payStatus: 'receipt_pay_status' },
    detailFields: [
      { label: '编号', fieldName: 'id' },
      { label: '供应商[发票主体]', fieldName: 'customerName', span: 2 },
      { label: '发票金额(元)', fieldName: 'amount', format: money },
      { label: '开票类型', fieldName: 'invoiceType', dictKey: 'invoice_type' },
      { label: '审批状态', fieldName: 'checkStatus', dictKey: 'check_status' },
      { label: '当前审核人', fieldName: 'checkName' },
      { label: '发票状态', fieldName: 'openStatus', dictKey: 'open_status' },
      { label: '付款状态', fieldName: 'payStatus', dictKey: 'receipt_pay_status' },
      { label: '收票时间', fieldName: 'openTime' },
      { label: '发票号码', fieldName: 'code' },
      { label: '录入时间', fieldName: 'createTime' }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '发票金额(元)', fieldName: 'totalAmount', type: 'money' },
      { label: '已付款金额(元)', fieldName: 'totalPayAmount', type: 'money' },
      { label: '未付款金额(元)', fieldName: 'unpaidAmount', type: 'money' }
    ]
  },
  income: {
    title: '回款记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, align: 'center' },
      { fieldName: 'amount', label: '回款金额(元)', width: 130, align: 'right', format: money },
      { fieldName: 'enterTime', label: '回款时间', width: 130, format: dateOnly },
      { fieldName: 'invoiceId', label: '发票Id', width: 100, align: 'center' },
      { fieldName: 'invoiceTitle', label: '发票抬头', minWidth: 200, searchable: { type: 'input', fieldName: 'invoiceTitle', placeholder: '请输入发票抬头', label: '发票抬头', order: 1 } },
      { fieldName: 'userName', label: '申请人', width: 110 },
      { fieldName: 'deptName', label: '申请部门', width: 110 },
      { fieldName: 'createTime', label: '发票申请时间', width: 170, format: dateTime },
      { fieldName: 'remarks', label: '备注信息', minWidth: 180 }
    ],
    dictMap: {},
    detailFields: [
      { label: '编号', fieldName: 'id' },
      { label: '回款金额(元)', fieldName: 'amount', format: money },
      { label: '回款时间', fieldName: 'enterTime' },
      { label: '发票Id', fieldName: 'invoiceId' },
      { label: '发票抬头', fieldName: 'invoiceTitle', span: 2 },
      { label: '申请人', fieldName: 'userName' },
      { label: '申请部门', fieldName: 'deptName' },
      { label: '发票申请时间', fieldName: 'createTime' },
      { label: '备注信息', fieldName: 'remarks', span: 2 }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '回款总额(元)', fieldName: 'totalAmount', type: 'money' }
    ]
  },
  payment: {
    title: '付款记录',
    columns: [
      { fieldName: 'id', label: 'ID号', width: 90, align: 'center' },
      { fieldName: 'amount', label: '付款金额(元)', width: 130, align: 'right', format: money },
      { fieldName: 'payTime', label: '付款时间', width: 130, format: dateOnly },
      { fieldName: 'ticketCode', label: '发票编码', width: 130 },
      { fieldName: 'invoiceTitle', label: '发票抬头', minWidth: 200, searchable: { type: 'input', fieldName: 'invoiceTitle', placeholder: '请输入发票抬头', label: '发票抬头', order: 1 } },
      { fieldName: 'adminName', label: '申请人', width: 110 },
      { fieldName: 'deptName', label: '申请部门', width: 110 },
      { fieldName: 'createTime', label: '发票申请时间', width: 170, format: dateTime },
      { fieldName: 'remarks', label: '备注信息', minWidth: 180 }
    ],
    dictMap: {},
    detailFields: [
      { label: '编号', fieldName: 'id' },
      { label: '付款金额(元)', fieldName: 'amount', format: money },
      { label: '付款时间', fieldName: 'payTime' },
      { label: '发票编码', fieldName: 'ticketCode' },
      { label: '发票抬头', fieldName: 'invoiceTitle', span: 2 },
      { label: '申请人', fieldName: 'adminName' },
      { label: '申请部门', fieldName: 'deptName' },
      { label: '发票申请时间', fieldName: 'createTime' },
      { label: '备注信息', fieldName: 'remarks', span: 2 }
    ],
    summaryFields: [
      { label: '记录数', fieldName: 'recordCount', type: 'count' },
      { label: '付款总额(元)', fieldName: 'totalAmount', type: 'money' }
    ]
  }
}

export default statConfig
