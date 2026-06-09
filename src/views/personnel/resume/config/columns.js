import { listUser } from '@/api/system/user.js';
import { getPageList } from '@/api/base/hr/careProgram/index.js';

// 搜索表单
export const queryForm = {  
  rewardType: '',
  rewardItem: '',
  rewardEmp: '',
  rewardDate: '',
  keywords: ''
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
    fieldName: 'name',
    label: '姓名',
    width: "10%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'thing',
      placeholder: '请输入',
      label: '姓名',
      order: 1,
    },
  },
  {
    fieldName: 'sex',
    label: '性别',
    width: "6%",
    minWidth: 140,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "6%",
    minWidth: 140,
    align: 'center',
  },
  {
    fieldName: 'phone',
    label: '手机号',
    width: "14%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'city',
    label: '所在城市',
    width: "auto",
    minWidth: 140,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'thing',
      placeholder: '请输入',
      label: '所在城市',
      order: 1,
    },
  },
];

// 操作列
export const operationColumn = {
  label: '操作',
  width: 280, 
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '已通过', type: 'warning', size: 'small', icon: 'check' },
    { label: '未通过', type: 'danger', size: 'small', icon: 'close' },
    { label: '入职', type: 'success', size: 'small', icon: 'user-check' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' }
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加简历',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete, onPass, onReject, onEntry) => ({
  label: '操作',
  width: 280,
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
      label: '确认入职',
      type: 'success',
      size: 'small',
      onClick: row => onEntry?.(row),
      icon: 'user-check'
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: row => onDelete?.(row),
      icon: 'delete'
    },
    {
      label: '已通过',
      type: 'warning',
      size: 'small',
      onClick: row => onPass?.(row),
      icon: 'check'
    },
    {
      label: '未通过',
      type: 'danger',
      size: 'small',
      onClick: row => onReject?.(row),
      icon: 'close'
    },
  ]
});

export const basicSearchFields = columns
  .filter(col => col.searchable && col.show !== false && (col.searchable.order <= 4))
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export const advancedSearchFields = columns
  .filter(col => col.searchable && col.show !== false)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

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
  basicSearchFields,
  advancedSearchFields,
  allSearchFields,
  queryForm
};