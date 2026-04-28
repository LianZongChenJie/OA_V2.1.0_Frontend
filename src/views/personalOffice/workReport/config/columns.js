export const columns = [
  {
    fieldName: '序号',
    label: 'ID',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'types',
    label: '汇报类型',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'status',
    label: '发送状态',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'admin',
    label: '接收人',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'works',
    label: '工作内容',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'time',
    label: '汇报周期',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '汇报时间',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'status',
    label: '附件（个）',
    width: "auto",
    minWidth: 100,
    align: 'center',
  },
];


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

export const getHeaderButs = (onAdd, showAddButton = true) => {
  if (!showAddButton) return [];
  
  return [
    { 
      label: '新增汇报', 
      type: 'primary', 
      icon: 'plus', 
      size: 'default', 
      onClick: onAdd 
    },
  ];
};

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

export default {
  columns,
  getHeaderButs
};
