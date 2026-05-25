import { listUser } from '@/api/system/user.js';

// 查询表单
export const queryForm = {
  types: '',         
  timeRange: '',       
  works: '',      
};

// 表格列配置
export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'typesName',
    label: '汇报类型',
    width: "8%",
    minWidth: 80,
    align: 'center',
    enum: {
      1: '日报',
      2: '周报',
      3: '月报'
    },
    searchable: {
      type: 'select',
      fieldName: 'types',
      label: '汇报类型',
      placeholder: '请选择汇报类型',
      order: 2,
      options: [
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 },
      ]
    },
  },
  {
    fieldName: 'sendStatus',
    label: '发送状态',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'works',
    label: '工作内容',
    minWidth: 240,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入工作内容',
      label: '工作内容',
      order: 3,
    },
  },
  {
    fieldName: 'toNames',
    label: '接收人',
    width: "12%",
    minWidth: 160,
    align: 'center',
    format: (val) => {
      if (!val) return '-';
      if (Array.isArray(val)) {
        return val.join('、');
      }
      return val;
    }
  },
  {
    fieldName: 'period',
    label: '汇报周期',
    width: "18%",
    minWidth: 200,
    align: 'center',
    format: (val) => val?.split(' ')[0] || '', 
  },
  {
    fieldName: 'createTime',
    label: '汇报时间',
    width: "auto",
    minwidth: 180,
    align: 'center',
      searchable: {
      type: 'dateRange',
      fieldName: 'rewardsTime',
      searchKey: ['beginTime', 'endTime'],
      label: '汇报时间',
      placeholder: '请选择时间',
      order: 1
    }
  },
    // {
    //   fieldName: 'fileCount',
    //   label: '附件（个）',
    //   width: "auto",
    //   minWidth: 100,
    //   align: 'center',
    // },
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
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' },
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '新建汇报',
    type: 'primary',
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
      isShow: (row) => row.sendStatus === "未发送",
      onClick: (row) => {
        onEdit && onEdit(row);
      },
      icon: 'edit'
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        onView && onView(row);
      },
      icon: 'eye-open'
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      isShow: (row) => row.sendStatus === "未发送",
      onClick: (row) => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

// 生成搜索字段
export const searchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName,
    type: col.searchable.type,
    formatValue: col.searchable.formatValue
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