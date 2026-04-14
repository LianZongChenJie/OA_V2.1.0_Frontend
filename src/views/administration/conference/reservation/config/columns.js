
export const queryForm = {
  keywords: '', 
};


export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "5%",
    minWidth: 80,
    align: 'center',
  },
  { fieldName: 'checkStatus', 
    label: '审批状态',
     width: "10%", 
     align: 'center',
    formatter: (row) => {
      const map = {0:'待提交',1:'审批中',2:'已通过',3:'已驳回'};
      return map[row.checkStatus] || '待提交';
  }
  },
  { fieldName: 'title', 
    label: '会议主题', 
    width: "15%",
    searchable: 
    { 
      type: 'input', 
      fieldName: '关键词', 
      placeholder: '关键词', 
      order: 1 
    }
  },
  { fieldName: 'meetingDate', 
    label: '会议时间', 
    width: "20%", 
    align: 'center',
    formatter: (row) => {
      // 这里自动拼接
      return row.startDate + ' 至 ' + row.endDate;
    }
  },
  { 
    fieldName: 'roomName', 
    label: '会议室', 
    width: "10%", 
    align: 'center' 
  },
  { 
    fieldName: 'num', 
    label: '人数',
     width: "8%", 
     align: 'center'
  },
  {
     fieldName: 'adminName', 
    label: '审核人',
     width: "10%",
      align: 'center' 
  },
  { 
    fieldName: 'creatorName', 
    label: '申请人',
     width: "8%", 
     align: 'center' 
  },
  { 
    fieldName: 'createTime',
     label: '创建时间',
      width: "12%",
       align: 'center' 
  }
];


export const operationColumn = {
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
        {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row, onEdit) => {
        onEdit && onEdit(row);
      },
      icon: 'edit',
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row, onView) => {
        onView && onView(row);
      },
      icon: 'eye-open',
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: (row, onDelete) => {
        onDelete && onDelete(row);
      },
      icon: 'delete',
    },
  ],
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加会议室',
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
      label: '编辑',
      type: 'success',
      size: 'small',
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
      onClick: (row) => {
        onDelete && onDelete(row);
      },
      icon: 'delete'
    }
  ]
});

// 提取搜索配置（对应截图搜索框）
export const searchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName,
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