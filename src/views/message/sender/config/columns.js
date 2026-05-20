export const queryForm = {
  meetingDate: '',
  anchorId: '',
  title: '',
};

export const columns = [
  {
    fieldName: 'title',
    label: '消息主题',
    minWidth: 260,
    searchable: {
      type: 'input',
      fieldName: 'keyword',
      placeholder: '消息主题',
      label: '消息主题',
      order: 3,
    },
  },
  {
    fieldName: 'typesStr',
    label: '消息类型',
    width: "8%",
    minWidth: 60,
    align: 'center',
  },
  {
    fieldName: 'toUserName',
    label: '接收人',
    width: "15%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'copyNames',
    label: '抄送人',
    width: "15%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'sendTime',
    label: '发件时间',
    width: "auto",
    minWidth: 140,
    align: 'center',
    searchable: {
      type: 'dateRange',
      fieldName: 'meetingDate',
      searchKey: ['beginTime', 'endTime'],
      placeholder: '请选择发件时间',
      label: '发件时间',
      order: 1,
    },
  },
];

export const operationColumn = {
  label: '操作',
  width: 120,
  fixed: 'right',
  show: true,
  actions: [
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
export const getHeaderButs = (onAdd, onBatchDelete) => [
  {
    label: '新建消息',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  },
  {
    label: '批量删除',
    type: 'danger',
    icon: 'Delete',
    size: 'default',
    onClick: onBatchDelete
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 170,
  fixed: 'right',
  show: true,
  actions: [
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
      onClick: (row) => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

// 获取完整的列配置
export const getFullColumns = () => {
  return [...columns];
};

// 提取搜索配置
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
  getOperationColumn,
  getFullColumns,
  searchFields,
  getHeaderButs,
  queryForm
};