import { listUser } from "@/api/system/user.js";

export const queryForm = {
  meetingDate: '',
  anchorId: '',
  title: '',
};

export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: "8%",
    minWidth: 60,
    align: 'center',
  },
  {
    fieldName: 'meetingDate',
    label: '会议时间',
    width: "15%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'date',
      fieldName: 'meetingDate',
      placeholder: '请选择会议时间',
      label: '会议时间',
      order: 1,
    },
    // 时间戳转日期格式化
    formatter: (row) => {
      if (!row.meetingDate) return '-';
      // 兼容10位/13位时间戳
      const timestamp = row.meetingDate.toString().length === 10 ? row.meetingDate * 1000 : row.meetingDate;
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    }
  },
  {
    fieldName: 'title',
    label: '会议主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'title',
      placeholder: '会议主题',
      label: '会议主题',
      order: 3,
    },
  },
  {
    fieldName: 'deptName',
    label: '主办部门',
    width: "25%",
    minWidth: 150,
    align: 'center',
  },
  {
    fieldName: 'anchorName',
    label: '主持人',
    width: "12%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'anchorId',
      placeholder: '请选择主持人',
      label: '主持人',
      order: 2,
    },
  },
  {
    fieldName: 'recorderName',
    label: '记录人',
    width: "auto",
    minWidth: 100,
    align: 'center',
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
    label: '会议记录',
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
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm
};