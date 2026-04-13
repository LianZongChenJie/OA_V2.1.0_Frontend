export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'checkStatus',
    label: '审核状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'check_status',
  },
  {
    fieldName: 'title',
    label: '公文主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 0,
    },
  },
  {
    fieldName: 'code',
    label: '公文编号',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'secrets',
    label: '密级程度',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'secrets_level',
    searchable: {
      type: 'select',
      dictKey: 'secrets_level',
      fieldName: 'secrets',
      placeholder: '请选择密级程度',
      label: '密级程度',
      order: 1,
    },
  },
  {
    fieldName: 'urgency',
    label: '紧急程度',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'urgency_level',
    searchable: {
      type: 'select',
      dictKey: 'urgency_level',
      fieldName: 'urgency',
      placeholder: '请选择紧急程度',
      label: '紧急程度',
      order: 2,
    },
  },
  {
    fieldName: 'draftName',
    label: '拟稿人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'draftTime',
    label: '拟稿日期',
    width: 160,
    minWidth: 140,
  },
  {
    fieldName: 'draftDname',
    label: '拟稿部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
];

export const operationColumn = {
  label: '操作',
  width: 180,
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
  ],
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete) => {
  return {
    label: '操作',
    width: 240,
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
        label: '详情',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
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

export default {
  columns,
  operationColumn,
  getHeaderButs
};
