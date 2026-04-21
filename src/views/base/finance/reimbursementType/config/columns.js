export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '类型名称',
    width: "50%",
    minWidth: 150,
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "20%",
    minWidth: 100,
    align: 'center',
  },
];
export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDisable, onEnable) => {
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
        isShow: (row) => row.status === 1,  // 状态为1时显示禁用按钮
      },
      {
        label: '启用',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onEnable && onEnable(row);
        },
        icon: 'enable',
        isShow: (row) => row.status === 0,  // 状态为0时显示启用按钮
      }
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
