const hasPermi = (permissions, perms) =>
  !perms || permissions.includes('*:*:*') || permissions.includes(perms)

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const number = Number(value)
  return Number.isNaN(number) ? '-' : number.toFixed(2)
}

const formatDays = formatAmount

// 表格列：严格按图片 16 列
export const columns = [
  { fieldName: 'seq', label: '序号', width: 80, minWidth: 70, align: 'center' },
  { fieldName: 'statYear', label: '年度', width: 90, minWidth: 80, align: 'center' },
  { fieldName: 'statMonth', label: '月份', width: 90, minWidth: 80, align: 'center' },
  { fieldName: 'customerName', label: '客户名称', minWidth: 180 },
  { fieldName: 'employeeName', label: '姓名', width: 120, minWidth: 100 },
  { fieldName: 'positionName', label: '职位', width: 120, minWidth: 100 },
  { fieldName: 'levelName', label: '级别', width: 100, minWidth: 90 },
  { fieldName: 'unitPrice', label: '单价（元）', width: 130, minWidth: 120, align: 'right', format: formatAmount },
  {
    fieldName: 'actualAttendanceDays',
    label: '实际出勤（天）',
    width: 150,
    minWidth: 140,
    align: 'right',
    format: formatDays
  },
  { fieldName: 'leaveDays', label: '请假（天）', width: 120, minWidth: 110, align: 'right', format: formatDays },
  { fieldName: 'overtimeDays', label: '加班（天）', width: 120, minWidth: 110, align: 'right', format: formatDays },
  { fieldName: 'compOffDays', label: '调休（天）', width: 120, minWidth: 110, align: 'right', format: formatDays },
  {
    fieldName: 'payableAmount',
    label: '实际应结算费用（元）',
    width: 190,
    minWidth: 180,
    align: 'right',
    format: formatAmount
  },
  {
    fieldName: 'settledAmount',
    label: '实际结算费用',
    width: 150,
    minWidth: 130,
    align: 'right',
    format: formatAmount
  },
  {
    fieldName: 'isSettled',
    label: '是否结算（是/否）',
    width: 150,
    minWidth: 140,
    align: 'center'
  },
  { fieldName: 'remark', label: '备注', width: 160, minWidth: 120 }
]

export const getHeaderButs = (onAdd, onImport, onExport, permissions = []) => [
  {
    label: '新增',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd,
    permi: 'service:customerSettlement:add'
  },
  {
    label: '导入',
    type: 'primary',
    icon: 'upload',
    size: 'default',
    onClick: onImport,
    permi: 'service:customerSettlement:import'
  },
  {
    label: '导出',
    type: 'warning',
    icon: 'download',
    size: 'default',
    onClick: onExport,
    permi: 'service:customerSettlement:export'
  }
].filter((btn) => hasPermi(permissions, btn.permi))

export const getOperationColumn = (onEdit, onView, onDelete, permissions = []) => ({
  label: '操作',
  width: 220,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      icon: 'edit',
      onClick: onEdit,
      isShow: () => hasPermi(permissions, 'service:customerSettlement:edit')
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      icon: 'eye-open',
      onClick: onView,
      isShow: () => hasPermi(permissions, 'service:customerSettlement:query')
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      icon: 'delete',
      onClick: onDelete,
      isShow: () => hasPermi(permissions, 'service:customerSettlement:remove')
    }
  ].filter((action) => action.isShow())
})
