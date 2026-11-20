const hasPermi = (permissions, perms) =>
  !perms || permissions.includes('*:*:*') || permissions.includes(perms)

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const number = Number(value)
  return Number.isNaN(number) ? '-' : number.toFixed(2)
}

const amount = (fieldName, label, width = 150) => ({
  fieldName,
  label,
  width,
  minWidth: 120,
  align: 'right',
  format: formatMoney
})

export const columns = [
  { fieldName: 'seq', label: '序号', width: 80, align: 'center' },
  { fieldName: 'employeeStatus', label: '员工状态', width: 100, align: 'center' },
  { fieldName: 'cityName', label: '城市', width: 110 },
  { fieldName: 'statMonth', label: '月份', width: 100, align: 'center' },
  { fieldName: 'orgName', label: '组织架构', width: 140 },
  { fieldName: 'employeeName', label: '姓名', width: 100 },
  { fieldName: 'idCard', label: '身份证号码', minWidth: 180 },
  { fieldName: 'entryDateStr', label: '入职日期', width: 110, align: 'center' },
  { fieldName: 'entryRecordDateStr', label: '入职记录', width: 110, align: 'center' },
  { fieldName: 'projectName', label: '目前所在项目', minWidth: 180 },
  amount('contractSalary', '合同工资'),
  { fieldName: 'salaryRatio', label: '算薪比例', width: 110, align: 'center' },
  amount('baseSalary', '基本工资'),
  amount('performanceSalary', '绩效工资'),
  amount('postSalary', '岗位工资'),
  { fieldName: 'attendanceDays', label: '考勤（天）', width: 120, align: 'right', format: formatMoney },
  amount('customerFeeTaxIncluded', '客户费用单', 160),
  amount('computerSubsidy', '电脑补助（加）'),
  amount('mealSubsidy', '工作日餐补（加）', 160),
  amount('bonus', '奖金（加）'),
  amount('subsidy', '补助（加）'),
  amount('deduction', '扣款（迟到/请假/工会）（减）', 200),
  amount('otherDeduction', '其他扣款（社保补基差额）（减）', 220),
  amount('grossSalary', '未扣五险一金薪资总额', 200),
  amount('pensionPersonal', '养老个人部分'),
  amount('medicalPersonal', '医疗个人部分'),
  amount('unemploymentPersonal', '失业个人部分'),
  amount('socialPersonalTotal', '社保个人合计'),
  amount('housingFundPersonal', '公积金个人部分', 170),
  amount('taxableSalary', '扣除五险一金税前工资', 200),
  amount('incomeTax', '个税代扣代缴'),
  amount('bankPayAmount', '银行实际支付金额', 170),
  amount('pensionCompany', '养老单位部分'),
  amount('unemploymentCompany', '失业单位部分'),
  amount('injuryCompany', '工伤单位部分'),
  amount('medicalMaternityCompany', '（医疗+生育）单位部分', 210),
  amount('socialCompanyTotal', '社保单位合计'),
  amount('housingFundCompany', '公积金单位部分', 170),
  amount('socialTotal', '社保总合计'),
  amount('housingFundTotal', '公积金总合计'),
  amount('companyTotalCost', '企业总成本'),
  amount('socialBase', '社保基数'),
  amount('housingFundBase', '公积金基数'),
  { fieldName: 'remark', label: '备注', width: 160, minWidth: 120 },
  amount('grossProfit', '毛利'),
  amount('taxDeclarationAmount', '个税申报金额', 160)
]

const summaryAmount = (fieldName, label, width = 160) => ({
  fieldName,
  label,
  width,
  minWidth: 130,
  align: 'right',
  format: formatMoney
})

const summaryColumns = (firstLabel) => [
  { fieldName: 'name', label: firstLabel, minWidth: 160 },
  summaryAmount('grossSalary', '未扣五险一金薪资总额', 220),
  summaryAmount('socialPersonalTotal', '社保个人合计', 190),
  summaryAmount('housingFundPersonal', '公积金个人部分', 200),
  { fieldName: 'incomeTaxCount', label: '计数项:个税代扣代缴', width: 160, align: 'right' },
  summaryAmount('bankPayAmount', '银行实际支付金额', 200),
  summaryAmount('socialCompanyTotal', '社保单位合计', 190),
  summaryAmount('housingFundCompany', '公积金单位部分', 200),
  summaryAmount('companyTotalCost', '企业总成本', 180),
  summaryAmount('customerFeeTaxIncluded', '客户费用单（含税）', 220),
  summaryAmount('taxExcludedRevenue', '不含税收入', 160),
  summaryAmount('grossProfit', '毛利', 140)
]

export const orgSummaryColumns = summaryColumns('组织架构')
export const citySummaryColumns = summaryColumns('城市')

export const getHeaderButs = (onAdd, onImport, onExport, permissions = []) => [
  {
    label: '新增',
    type: 'success',
    icon: 'plus',
    onClick: onAdd,
    permi: 'hr:cost:add'
  },
  {
    label: '导入',
    type: 'primary',
    icon: 'upload',
    onClick: onImport,
    permi: 'hr:cost:import'
  },
  {
    label: '导出',
    type: 'warning',
    icon: 'download',
    onClick: onExport,
    permi: 'hr:cost:export'
  }
].filter((btn) => hasPermi(permissions, btn.permi))

export const getSummaryButs = (onExport, permissions = []) => [
  {
    label: '导出',
    type: 'warning',
    icon: 'download',
    onClick: onExport,
    permi: 'hr:cost:export'
  }
].filter((btn) => hasPermi(permissions, btn.permi))

export const getOperationColumn = (onEdit, onView, onDelete, permissions = []) => ({
  label: '操作',
  width: 220,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit', onClick: onEdit, permi: 'hr:cost:edit' },
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open', onClick: onView, permi: 'hr:cost:query' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete', onClick: onDelete, permi: 'hr:cost:remove' }
  ].filter((action) => hasPermi(permissions, action.permi))
})
