export const columns = [
  {
    fieldName: 'id',
    label: '模版ID',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'name',
    label: '模版标识',
    width: "15%",
    minWidth: 150, 
  },
  {
    fieldName: 'title',
    label: '模版名称',
    width: "50%",
    minWidth: 300,
    searchable: {
      type: 'input',
      fieldName: 'title',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'adminName',
    label: '创建人',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
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

 export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onChangeStatus, onCopy) => {
  return {
    label: '操作',
    width: 170,
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
        icon: 'eye-open',
      },
      {
        label: '禁用',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onChangeStatus && onChangeStatus(row);
        },
        isShow: (row) => row.status === 1,
        icon: 'lock',
      },
      {
        label: '启用',
        type: 'warning',
        size: 'small',
        onClick: (row) => {
          onChangeStatus && onChangeStatus(row);
        },
        isShow: (row) => row.status === 0,
        icon: 'enter',
      },
      {
        label: '复制',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onCopy && onCopy(row);
        },
        icon: 'clipboard',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs,
  getOperationColumn
};
