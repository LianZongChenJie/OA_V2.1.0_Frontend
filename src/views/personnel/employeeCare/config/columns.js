// 搜索表单（增加 keywords）
export const queryForm = {
  rewardStatus: '',
  rewardType: '',
  rewardItem: '',
  rewardEmp: '',
  rewardDate: '',
  keywords: '' // 全局关键字
};

// 列表列配置
export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "6%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
    slot: true,
    slotName: 'status',
    searchable: {
      type: 'select',
      fieldName: 'rewardStatus',
      label: '关怀状态',
      placeholder: '请选择',
      order: 1,
      options: [
        { label: '待执行', value: 1 },
        { label: '已执行', value: 0 }
      ]
    },
  },
  {
    fieldName: 'empName',
    label: '员工',
    width: "10%",
    minWidth: 120,
    searchable: {
      type: 'select',
      fieldName: 'rewardEmp',
      label: '关怀员工',
      placeholder: '请选择人员',
      order: 3, // 调整order值以控制显示顺序
      // 关键修复：直接配置用户接口，自动加载
      api: () => import('@/api/system/user.js').then(m => m.listUser({ pageSize: 1000 })),
      labelField: 'userName',
      valueField: 'userId',
    },
  },
  {
    fieldName: 'rewardItem',
    label: '关怀项目',
    width: "12%",
    minWidth: 140,
    searchable: {
      type: 'select',
      fieldName: 'rewardItem',
      label: '关怀项目',
      placeholder: '请选择',
      order: 2, // 调整order值以控制显示顺序
      options: [
        { label: '礼品', value: '礼品' },
        { label: '节日', value: '节日' },
        { label: '生日', value: '生日' },
        { label: '其他', value: '其他' },
      ]
    },
  },
  {
    fieldName: 'rewardDate',
    label: '关怀日期',
    width: "12%",
    minWidth: 140,
    searchable: {
      type: 'dateRange',
      fieldName: 'rewardDate',
      label: '关怀日期',
      placeholder: '请选择',
      order: 4, // 调整order值以控制显示顺序
    },
  },
  {
    fieldName: 'amount',
    label: '金额(元)',
    width: "8%",
    minWidth: 100,
    align: 'right',
  },
  {
    fieldName: 'gift',
    label: '物品',
    width: "10%",
    minWidth: 120,
        searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入',
      label: '关键字',
      order: 5,
    },
  },
  {
    fieldName: 'createBy',
    label: '创建人',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "15%",
    minWidth: 180,
  },
];

// 操作列
export const operationColumn = {
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    { label: '详情', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' }
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加奖罚管理',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: row => onView?.(row),
      icon: 'eye-open'
    },
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: row => onEdit?.(row),
      icon: 'edit'
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: row => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

// 基础搜索字段（只包含order值较小的字段，会在初始状态下显示）
export const basicSearchFields = columns
  .filter(col => col.searchable && col.show !== false && (col.searchable.order <= 4))
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

// 高级搜索字段（包含所有字段，用于展开时显示）
export const advancedSearchFields = columns
  .filter(col => col.searchable && col.show !== false)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

// 所有搜索字段（包括不显示在表格中的）
export const allSearchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export default {
  columns,
  operationColumn,
  getHeaderButs,
  getOperationColumn,
  basicSearchFields,     // 基础搜索字段
  advancedSearchFields,  // 高级搜索字段
  allSearchFields,       // 所有搜索字段
  queryForm
};
