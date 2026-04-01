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
    label: '企业名称',
    width: "45%",
    minWidth: 300,
  },
  {
    fieldName: 'city',
    label: '所在城市',
    width: "5%",
    minWidth: 100,
    align: 'center', 
  },
  {
    fieldName: 'address',
    label: '详细地址',
    width: "40%",
    minWidth: 300,  
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
      onClick: (row) => {
        console.log('===查看', row)
      },
      isShow: (row) => true,
      icon: 'eye-open',
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

export const getOperationColumn = (onEdit, onDisable, onView) => {
  return {
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
        icon: 'edit',
      },
      {
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        isShow: (row) => true,
        icon: 'eye-open',
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
