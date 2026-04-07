
export const queryForm = {
  title: '', 
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
    label: '供应商名称',
    width: "50%",
    minWidth: 300,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'address',
    label: '供应商地址',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'phone',
    label: '供应商电话',
    width: "10%",
    minWidth: 160,
  },
  {
    fieldName: 'email',
    label: '供应商邮箱',
    width: "10%",
    minWidth: 160,
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
];

export const operationColumn = {
  label: '操作',
  width: 360,
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
      isShow: () => true,
      icon: 'eye-open',
    },
    {
      label: '禁用',
      type: 'danger',
      size: 'small',
      onClick: (row, onDisable) => {
        onDisable && onDisable(row);
      },
      isShow: (row) => row.status === 1,
      icon: 'lock',
    },
    {
      label: '启用',
      type: 'primary',
      size: 'small',
      onClick: (row, onenable) => {
        onenable && onenable(row);
      },
      isShow: (row) => row.status === 0,
      icon: 'unlock',
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

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDisable, onenable, onDelete) => {
  return {
    label: '操作',
    width: 360,
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
        icon: 'edit',
      },
      {
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        isShow: () => true,
        icon: 'eye-open',
      },
      {
        label: '禁用',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDisable && onDisable(row);
        },
        isShow: (row) => row.status === 1,
        icon: 'lock',
      },
      {
        label: '启用',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onenable && onenable(row);
        },
        icon: 'enable',
        isShow: (row) => row.status === 0,
      },
      {
        label: '删除',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
    ],
  };
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
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm,
};