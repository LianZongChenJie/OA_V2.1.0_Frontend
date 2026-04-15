export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'checkStatus',
    label: '审批状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'seal_check_status',
    searchable: {
      type: 'select',
      dictKey: 'seal_check_status',
      fieldName: 'checkStatus',
      placeholder: '请选择审批状态',
      label: '审批状态',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入主题',
      label: '关键字',
      order: 3,
    },
  },
  {
    fieldName: 'sealCateId',
    label: '用章类型',
    width: 120,
    minWidth: 100,
    dict: 'seal_type',
    searchable: {
      type: 'select',
      fieldName: 'sealCateId',
      dictKey: 'seal_type',
      label: '用章类型',
      order: 2,
    },
  },
  {
    fieldName: 'didDept',
    label: '用章部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'num',
    label: '盖章次数',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'adminName',
    label: '申请人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'createTime',
    label: '申请时间',
    width: 180,
    minWidth: 160,
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
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
  columns,
  getHeaderButs
};
