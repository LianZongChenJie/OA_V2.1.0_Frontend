
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
  {
    fieldName: 'title',
    label: '会议室名称',
    width: "20%",
    minWidth: 200,

    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '关键词',
      label: '关键词',
      order: 1,
    },
  },
  {
    fieldName: 'num',
    label: '可容纳人数',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'keepName',
    label: '管理员',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'address',
    label: '会议室地址',
    width: "20%",
    minWidth: 300,
  },
  {
    fieldName: 'device',
    label: '会议室设备',
    width: "20%",
    minWidth: 200,
    width: "auto",
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