export const columns = [
  { fieldName: "id", label: "ID号", width: 120, align: "left" },
  { fieldName: "pid", label: "父ID", width: 80, align: "center" },
  { fieldName: "title", label: "分类名", minWidth: 150, align: "left" },
  { fieldName: "sort", label: "排序", width: 80, align: "center" },
  { fieldName: "desc", label: "描述", minWidth: 150, align: "left" },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onAdd, onEdit, onDel) => {
  return {
    label: '操作',
    width: 300,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '添加子分类',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onAdd && onAdd(row);
        },
        isShow: (row) => {
          return row.pid === 0 || row.pid === '0';
        },
        icon: 'add',
      },
      {
        label: '编辑',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onEdit && onEdit(row);
        },
        icon: 'edit',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDel && onDel(row);
        },
        icon: 'delete',
      }
    ],
  };
};

export default {
  columns,
  getOperationColumn,
  getHeaderButs
};
