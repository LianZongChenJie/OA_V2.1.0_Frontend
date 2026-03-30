export const columns = [
  { fieldName: "id", label: "区划ID", width: 120, align: "left" },
  { fieldName: "name", label: "区划名称", minWidth: 150, align: "left" },
  { fieldName: "shortname", label: "区划简称", width: 120, align: "left" },
  { fieldName: "level", label: "级别", width: 80, align: "center", slotName: "level" },
  { fieldName: "longitude", label: "经度", width: 120, align: "center" },
  { fieldName: "latitude", label: "纬度", width: 120, align: "center" },
  { fieldName: "sort", label: "排序", width: 80, align: "center" },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onAdd, onEdit, onDel) => {
  return {
    label: '操作',
    width: 360,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '添加子节点',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onAdd && onAdd(row);
        },
        isShow: (row) => row.level < 3,
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
        label: '禁用',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDel && onDel(row);
        },
        icon: 'lock',
      }
    ],
  };
};

export default {
  columns,
  getOperationColumn,
  getHeaderButs
};
