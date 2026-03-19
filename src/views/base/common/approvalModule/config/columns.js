export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '模块名称',
    width: "80%",
    minWidth: 300,
  },
  {
    fieldName: 'sort',
    label: '排序',
    width: "5%",
    minWidth: 100,
    align: 'center', 
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
];

export const operationColumn = {
  label: '操作',
  width: 200,
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
      label: '禁用',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        console.log('===禁用', row)
      },
      icon: 'lock',
      isShow: (row) => row.status === 1,
    },
    {
      label: '启用',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        console.log('===启用', row)
      },
      icon: 'unlock',
      isShow: (row) => row.status === 0,
    },
  ],
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onDisable) => {
  return {
    label: '操作',
    width: 200,
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
        label: '禁用',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDisable && onDisable(row);
        },
        icon: 'lock',
        isShow: (row) => row.status === 1,
      },
      {
        label: '启用',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onDisable && onDisable(row);
        },
        icon: 'unlock',
        isShow: (row) => row.status === 0,
      },
    ],
  };
};

export default {
  columns,
  operationColumn,
  getHeaderButs
};
