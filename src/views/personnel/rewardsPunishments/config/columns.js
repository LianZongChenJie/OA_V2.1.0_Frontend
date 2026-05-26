import { listUser } from '@/api/system/user.js';
import { getPageList } from '@/api/base/hr/rewards/index.js';

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
    label: '奖罚状态',
    width: "8%",
    minWidth: 100,
    align: 'center',
    slot: true,
    slotName: 'status',
    searchable: {
      type: 'select',
      fieldName: 'status',
      label: '奖惩状态',
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
      searchParam: 'nickName',  // ← 指定搜索参数名
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'uid', 
      placeholder: '请选择员工',
      label: '员工',
      order: 6,
    },
  },
  {
    fieldName: 'typesStr',
    label: '奖惩类型',
    width: "10%",
    minWidth: 120,
    align: 'center',
    slot: true,
    slotName: 'rewardType',
    searchable: {
      type: 'select',
      fieldName: 'types',
      label: '奖惩类型',
      placeholder: '请选择',
      order: 2,
      options: [
        { label: '奖励', value: 1 },
        { label: '惩罚', value: 2 }
      ]
    },
  },
  {
    fieldName: 'cateName',
    label: '奖惩项目',
    width: "12%",
    minWidth: 140,
    align: 'center',
    searchable: {
      type: 'selectApi',
      searchParam: 'title',
      api: getPageList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'rewardsCate',
      label: '奖惩项目',
      placeholder: '请选择',
      order: 3,
    },
  },
{
  fieldName: 'rewardsTime',
  label: '奖惩日期',
  width: "12%",
  minWidth: 140,
  align: 'center',
  format: (val) => val?.split(' ')[0] || '', 
  searchable: {
    type: 'dateRange',
    fieldName: 'rewardsTime',
    searchKey: ['beginTime', 'endTime'],
    label: '奖惩日期',
    placeholder: '请选择时间',
    order: 4,
  }
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
    label: '奖罚物品',
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
    minwidth: 180,
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
    label: '添加奖惩管理',
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

// 搜索字段
export const searchFields = columns
  .filter(col => col.searchable && col.show !== false)
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
  searchFields,
  queryForm
};