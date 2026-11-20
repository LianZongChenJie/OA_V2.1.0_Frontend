const hasPermi = (permissions, perms) =>
  !perms || permissions.includes('*:*:*') || permissions.includes(perms)

// 表格列：严格按需求 15 列，年度列取 statMonth（YYYY-MM）
export const columns = [
  { fieldName: 'seq', label: '序号', width: 80, minWidth: 70, align: 'center' },
  { fieldName: 'statMonth', label: '年度', width: 110, minWidth: 100, align: 'center' },
  { fieldName: 'customerName', label: '客户名称', minWidth: 180 },
  { fieldName: 'projectName', label: '项目名称', minWidth: 200 },
  {
    fieldName: 'contractSigned',
    label: '合同是否签订',
    width: 130,
    minWidth: 110,
    align: 'center'
  },
  { fieldName: 'plannedCost', label: '预计投入成本', width: 140, minWidth: 120, align: 'right' },
  { fieldName: 'actualCost', label: '实际投入成本', width: 140, minWidth: 120, align: 'right' },
  { fieldName: 'plannedProfit', label: '预计项目利润', width: 140, minWidth: 120, align: 'right' },
  { fieldName: 'actualProfit', label: '实际项目利润', width: 140, minWidth: 120, align: 'right' },
  { fieldName: 'collectionAgreement', label: '合同收款约定', minWidth: 220 },
  { fieldName: 'invoicedAmount', label: '实际开票金额', width: 140, minWidth: 120, align: 'right' },
  { fieldName: 'receivedAmount', label: '实际收款金额', width: 140, minWidth: 120, align: 'right' },
  {
    fieldName: 'projectClosed',
    label: '是否结项',
    width: 100,
    minWidth: 90,
    align: 'center'
  },
  { fieldName: 'createTimeStr', label: '创建时间', width: 170, minWidth: 160, align: 'center' },
  { fieldName: 'updateTimeStr', label: '更新时间', width: 170, minWidth: 160, align: 'center' }
]

export const getHeaderButs = (onAdd, onImport, onExport, permissions = []) => [
  {
    label: '新增',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd,
    permi: 'project:monthly:add'
  },
  {
    label: '导入',
    type: 'primary',
    icon: 'upload',
    size: 'default',
    onClick: onImport,
    permi: 'project:monthly:import'
  },
  {
    label: '导出',
    type: 'warning',
    icon: 'download',
    size: 'default',
    onClick: onExport,
    permi: 'project:monthly:export'
  }
].filter((btn) => hasPermi(permissions, btn.permi))

export const getOperationColumn = (onEdit, onView, onDelete, permissions = []) => ({
  label: '操作',
  width: 180,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      icon: 'edit',
      onClick: onEdit,
      isShow: () => hasPermi(permissions, 'project:monthly:edit')
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      icon: 'eye-open',
      onClick: onView,
      isShow: () => hasPermi(permissions, 'project:monthly:query')
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      icon: 'delete',
      onClick: onDelete,
      isShow: () => hasPermi(permissions, 'project:monthly:remove')
    }
  ]
})
