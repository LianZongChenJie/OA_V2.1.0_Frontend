export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '公告主题',
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
    fieldName: 'cate_id',
    label: '所属分类',
    width: 120,
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '状态',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'admin',
    label: '创建人',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
  {
    fieldName: 'sourse',
    label: '公告平台',
    width: 120,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'note_sourse',
    searchable: {
      type: 'select',
      dictKey: 'note_sourse',
      fieldName: 'sourse',
      placeholder: '请选择公告平台',
      label: '公告平台',
      order: 1,
    },
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
