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
    label: '流程名称',
    width: "30%",
    minWidth: 200,
  },
  {
    fieldName: 'cateId',
    label: '审批流类型',
    width: "15%",
    minWidth: 200,
    align: 'center', 
  },
  {
    fieldName: 'checkType',
    label: '关联审批类型',
    width: "15%",
    minWidth: 200,
    align: 'center', 
  },
  {
    fieldName: 'departmentIds',
    label: '应用部门',
    width: "15%",
    minWidth: 200,
    align: 'center', 
  },
  {
    fieldName: 'copyUids',
    label: '抄送人',
    width: "15%",
    minWidth: 200,
    align: 'center',
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
      }
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
