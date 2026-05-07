import { listUser } from '@/api/system/user.js';

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
      fieldName: 'status',
      label: '合同状态',
      placeholder: '请选择',
      order: 1,
      options: [
        { label: '正常', value: 1 },
        { label: '已到期', value: 2 }
      ]
    },
  },
  {
    fieldName: 'userName',
    label: '员工',
    width: "8%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'uid',
      placeholder: '请选择员工',
      label: '员工',
      order: 5,
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
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'cate',
      label: '合同类别',
      placeholder: '请选择',
      order: 2,
      options: [
        { label: '劳动合同', value: '1' },
        { label: '劳务合同', value: '2' },
        { label: '实习协议', value: '3' },
        { label: '保密协议', value: '4' },
      ]
    },
  },
  {
    fieldName: 'typesName',
    label: '合同类型',
    width: "10%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'types',
      label: '合同类型',
      placeholder: '请选择',
      order: 3,
      options: [
        { label: '新签合同', value: '1' },
        { label: '续签合同', value: '2' },
        { label: '合同变更', value: '3' }
      ]
    },
  },
  {
    fieldName: 'enterpriseName',
    label: '签约主体公司',
    width: "25%",
    minWidth: 200,
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
      searchKey: ['beginTime','endTime'],
      label: '签订日期',
      placeholder: '请选择',
      order: 4,
    },
  },
  {
    fieldName: 'workTimeRange',
    label: '合同有效期间',
    width: "25%",
    minWidth: 200,
    align: 'center',
    slot: true,
    slotName: 'workTimeRange',
  },
  // {
  //   fieldName: 'renewalStatus',
  //   label: '续签状态',
  //   width: "8%",
  //   minWidth: 100,
  //   align: 'center',
  // },
  // {
  //   fieldName: 'changeStatus',
  //   label: '变更状态',
  //   width: "8%",
  //   minWidth: 100,
  //   align: 'center',
  // },
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
    minWidth: 180,
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