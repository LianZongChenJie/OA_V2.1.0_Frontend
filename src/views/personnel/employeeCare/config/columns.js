import { listUser } from '@/api/system/user.js';
import { getPageList } from '@/api/base/hr/careProgram/index.js';

// 搜索表单
export const queryForm = {
  rewardStatus: '',
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
    fieldName: 'statusStr',
    label: '关怀状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
    slot: true,
    slotName: 'status',
    searchable: {
      type: 'select',
      fieldName: 'status',
      label: '关怀状态',
      placeholder: '请选择',
      order: 1,
      options: [
        { label: '未执行', value: 1 },
        { label: '已执行', value: 2 }
      ]
    },
  },
  {
    fieldName: 'userName',
    label: '员工',
    width: "10%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'uid',
      label: '关怀员工',
      placeholder: '请选择人员',
      order: 3,
    },
  },
  {
    fieldName: 'cateName',
    label: '关怀项目',
    width: "12%",
    minWidth: 140,
    searchable: {
      type: 'selectApi',
      api: getPageList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'careCate',
      label: '关怀项目',
      placeholder: '请选择',
      order: 2,
    },
  },
  {
  fieldName: 'careTime',
  label: '关怀日期',
  width: "12%",
  minWidth: 100,
  align: 'center',
  format: (val) => val?.split(' ')[0] || '', 
  searchable: {
    type: 'dateRange',
    fieldName: 'rewardDate',
    searchKey: ['beginTime','endTime'],
    label: '关怀日期',
    placeholder: '请选择',
    order: 4
    },
  },
  {
    fieldName: 'cost',
    label: '金额(元)',
    width: "8%",
    minWidth: 100,
    align: 'right',
  },
  {
    fieldName: 'thing',
    label: '物品',
    width: "10%",
    minWidth: 120,
    searchable: {
      type: 'input',
      fieldName: 'thing',
      placeholder: '请输入',
      label: '关键字',
      order: 5,
    },
  },
  {
    fieldName: 'adminName',
    label: '创建人',
    width: "10%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "15%",
    minwidth: 170,
    align: 'center',
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
    label: '添加关怀管理',
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