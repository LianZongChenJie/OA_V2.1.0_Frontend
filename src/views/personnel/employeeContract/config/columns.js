
export const queryForm = {
  contractStatus: '',   
  contractCategory: '', 
  contractType: '',    
  contractAttr: '',   
  signEmp: '',         
  signDate: '',        
  keywords: ''         
};

export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "5%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'statusName',
    label: '合同状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
    slot: true,
    slotName: 'status',
    searchable: {
      type: 'select',
      fieldName: 'contractStatus',
      label: '合同状态',
      placeholder: '请选择',
      order: 1,
      options: [
        { label: '未到期', value: 1 },
        { label: '已到期', value: 0 }
      ]
    },
  },
  {
    fieldName: 'empName',
    label: '员工',
    width: "8%",
    minWidth: 120,
    searchable: {
      type: 'select',
      fieldName: 'signEmp',
      label: '签订员工',
      placeholder: '请选择人员',
      order: 5,
      api: () => import('@/api/system/user.js').then(m => m.listUser({ pageSize: 1000 })),
      labelField: 'userName',
      valueField: 'userId',
    },
  },
  {
    fieldName: 'title',
    label: '合同名称',
    width: "12%",
    minWidth: 140,
  },
  {
    fieldName: 'cateName',
    label: '合同类别',
    width: "10%",
    minWidth: 120,
    searchable: {
      type: 'select',
      fieldName: 'contractCategory',
      label: '合同类别',
      placeholder: '请选择',
      order: 2,
      options: [
        { label: '劳动合同', value: '劳动合同' },
        { label: '劳务合同', value: '劳务合同' },
        { label: '实习协议', value: '实习协议' },
        { label: '保密协议', value: '保密协议' },
      ]
    },
  },
  {
    fieldName: 'typesName',
    label: '合同类型',
    width: "10%",
    minWidth: 120,
    searchable: {
      type: 'select',
      fieldName: 'contractType',
      label: '合同类型',
      placeholder: '请选择',
      order: 3,
      options: [
        { label: '新签合同', value: '新签合同' },
        { label: '续签合同', value: '续签合同' }
      ]
    },
  },
    {
    fieldName: 'enterpriseName',
    label: '签约主体公司',
    width: "10%",
    minWidth: 120,
      searchable: {
      type: 'input',
      fieldName: 'keyword',
      placeholder: '请输入',
      label: '关键字',
      order: 7,
    },
  },
  {
    fieldName: 'signTime',
    label: '签订日期',
    width: "10%",
    minWidth: 140,
    align: 'center',
    format: (val) => val?.split(' ')[0] || '',
    searchable: {
      type: 'dateRange',
      fieldName: 'signDate',
      label: '签订日期',
      placeholder: '请选择',
      order: 4,
    },
  },
  {
    fieldName: 'validPeriod',
    label: '合同有效期间',
    width: "15%",
    minWidth: 180,
    align: 'center',
  },
  {
    fieldName: 'renewStatus',
    label: '续签状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'changeStatus',
    label: '变更状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
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
  width: 240,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' }
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加合同',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 240,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: row => onEdit?.(row),
      icon: 'edit'
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: row => onView?.(row),
      icon: 'eye-open'
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

// 基础搜索
export const basicSearchFields = columns
  .filter(col => col.searchable && col.show !== false && col.searchable.order <= 6)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName
  }))
  .sort((a, b) => a.order - b.order);

// 高级搜索
export const advancedSearchFields = columns
  .filter(col => col.searchable && col.show !== false)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName
  }))
  .sort((a, b) => a.order - b.order);

export const allSearchFields = advancedSearchFields;

export default {
  columns,
  operationColumn,
  getHeaderButs,
  getOperationColumn,
  basicSearchFields,
  advancedSearchFields,
  allSearchFields,
  queryForm
};