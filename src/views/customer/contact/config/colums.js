export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'name',
    label: '姓名',
    width: "10%",
    minWidth: 100,
    searchable: {
      type: 'input',
      fieldName: 'keyword',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'mobile',
    label: '手机号',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'email',
    label: '电子邮箱',
    width: "20%",
    minWidth: 160,
  },
  {
    fieldName: 'qq',
    label: 'QQ号码',
    width: "15%",
    minWidth: 100,
  },
  {
    fieldName: 'wechat',
    label: '微信号',
    width: "15%",
    minWidth: 100,
  },
  {
    fieldName: 'customerName',
    label: '关联客户',
    width: "30%",
    minWidth: 120,
  },
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
  columns
};
