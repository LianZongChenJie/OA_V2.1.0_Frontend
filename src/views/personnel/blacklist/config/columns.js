export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'name',
    label: '姓名',
    width: "10%",
    minWidth: 150, 
      searchable: {
      type: 'input',
      fieldName: 'title',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '手机号',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'title',
    label: '备注信息',
    width: "35%",
    minWidth: 150,
  },
  {
    fieldName: 'adminId',
    label: '创建人',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "auto",
    minWidth: 100,
  },
];

export const operationColumn = {
  label: '操作',
  width: 200,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' }
  ]
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 200,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: row => onEdit?.(row),
      icon: 'edit'
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: row => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

export default {
  columns,
  operationColumn,
  getHeaderButs
};
