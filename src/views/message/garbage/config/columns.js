import { listUser } from "@/api/system/user.js";

export const queryForm = {
  meetingDate: '',
  anchorId: '',
  title: '',
};

export const columns = [
  {
    fieldName: 'source',
    label: '来源',
    width: "15%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'fromName',
    label: '发送人',
    width: "15%",
    minWidth: 100,
    align: 'center',
  },
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
    fieldName: 'createTime',
    label: '创建时间',
    width: "auto",
    minWidth: 140,
    align: 'center',
  },
];

export const operationColumn = {
  label: '操作',
  width: 180,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '还原',
      type: 'success',
      size: 'small',
      onClick: (row, onRestore) => {
        onRestore && onRestore(row);
      },
      icon: 'eye-open', 
    },
    {
      label: '清除',
      type: 'danger',
      size: 'small',
      onClick: (row, onDelete) => {
        onDelete && onDelete(row);
      },
      icon: 'delete',
    },
  ],
};

// 操作列生成函数 
export const getOperationColumn = (onRestore, onView, onDelete) => ({
  label: '操作',
  width: 180,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '还原',
      type: 'success',
      size: 'small',
      onClick: (row) => {
        onRestore && onRestore(row);
      },
      icon: 'eye-open', 
    },
    {
      label: '清除',
      type: 'danger',
      size: 'small',
      onClick: (row) => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

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
  searchFields,
  queryForm
};