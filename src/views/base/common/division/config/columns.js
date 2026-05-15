export const columns = [
  { fieldName: "id", label: "区划ID", width: "25%", minWidth: 200, align: "left" },
  { fieldName: "name", label: "区划名称", width: "10%", minWidth: 150, align: "left" },
  { fieldName: "shortname", label: "区划简称", width: "10%", minWidth: 120, align: "left" },
  { fieldName: "level", label: "级别", width: "10%", minWidth: 100, align: "center", slotName: "level" },
  { fieldName: "longitude", label: "经度", width: "10%", minWidth: 120, align: "center" },
  { fieldName: "latitude", label: "纬度", width: "10%", minWidth: 100, align: "center" },
  { fieldName: "sort", label: "排序", width: "10%", minWidth: 100, align: "center" },
  { fieldName: "status", label: "状态", width: "10%", minWidth: 100, align: "center", slotName: "status" },
];

export const getOperationColumn = (onAdd, onEdit, onChangeStatus) => ({
  label: '操作',
  width: 360,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '添加子节点',
      type: 'primary',
      size: 'small',
      onClick: onAdd,
      isShow: (row) => row.level < 3,
      icon: 'add',
    },
    {
      label: '编辑',
      type: 'primary',
      size: 'small',
      onClick: onEdit,
      icon: 'edit',
    },
    {
      label: '禁用',
      type: 'danger',
      size: 'small',
      onClick: (row) => onChangeStatus(row, 0),
      isShow: (row) => row.status !== 0,
      icon: 'lock',
    },
    {
      label: '启用',
      type: 'success',
      size: 'small',
      onClick: (row) => onChangeStatus(row, 1),
      isShow: (row) => row.status === 0,
      icon: 'enter',
    }
  ],
});

export default {
  columns,
  getOperationColumn,
};
