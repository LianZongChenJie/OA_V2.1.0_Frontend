import { listUser } from "@/api/system/user.js";

export const queryForm = {
  meetingDate: '',
  anchorId: '',
  title: '',
};

export const columns = [
  {
    fieldName: 'typesStr',
    label: '消息类型',
    width: 100,
    align: 'center',
    formatter: (row) => {
      return row.fromUid === 0 ? '系统消息' : '用户消息';
    }
  },
  {
    fieldName: 'fromName',
    label: '发件人',
    width: 120,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '消息主题',
    minWidth: 300,
    searchable: {
      type: 'input',
      fieldName: 'keyword',
      placeholder: '消息主题',
      label: '消息主题',
      order: 3,
    },
  },
  {
    fieldName: 'createTime',
    label: '收件时间',
    width: 160,
    align: 'center',
    searchable: {
      type: 'dateRange',
      fieldName: 'meetingDate',
      searchKey: ['beginTime', 'endTime'],
      placeholder: '请选择收件时间',
      label: '收件时间',
      order: 1,
    },
  },
  {
    fieldName: 'isReadStr',
    label: '是否已读',
    width: 100,
    align: 'center',
    formatter: (row) => {
      return row.readTime === 0 ? '未读' : '已读';
    }
  },
  // {
  //   fieldName: 'isStar',
  //   label: '是否星标',
  //   width: 100,
  //   align: 'center',
  //   slot: true,  
  // }
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
export const getHeaderButs = (onBatchDelete, onBatchRead, onBatchStar) => [
  {
    label: '批量删除',
    type: 'danger',
    icon: 'Delete',
    size: 'default',
    onClick: onBatchDelete
  },
  // {
  //   label: '设为已读',
  //   type: 'primary',
  //   icon: 'View',
  //   size: 'default',
  //   onClick: onBatchRead
  // },
  {
    label: '取消星标',
    type: 'warning',
    icon: 'Star',
    size: 'default',
    onClick: onBatchStar
  }
];

// 操作列生成函数
export const getOperationColumn = (onView, onDelete) => ({
  label: '操作',
  width: 160,
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