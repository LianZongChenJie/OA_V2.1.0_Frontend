export const columns = [
  {
    fieldName: 'operId',
    label: '日志编号',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '系统模块',
    width: "15%",
    minWidth: 150,
    searchable: {
      type: 'input',
      fieldName: 'title',
      placeholder: '请输入系统模块',
      label: '系统模块',
      order: 1,
    },
    showOverflowTooltip: true,
  },
  {
    fieldName: 'businessType',
    label: '操作类型',
    width: "10%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'businessType',
      placeholder: '操作类型',
      label: '类型',
      order: 3,
      dictType: 'sys_oper_type',
    },
    slot: 'businessType',
  },
  {
    fieldName: 'operName',
    label: '账号',
    width: "10%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'operNickName',
    label: '操作人员',
    width: "10%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'operNickName',
      placeholder: '请输入操作人员',
      label: '操作人员',
      order: 2,
    },
    showOverflowTooltip: true,
    sortable: true,
  },
  {
    fieldName: 'operIp',
    label: '操作地址',
    width: "12%",
    minWidth: 150,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'operIp',
      placeholder: '请输入操作地址',
      label: '操作地址',
      order: 0,
    },
    showOverflowTooltip: true,
  },
  {
    fieldName: 'status',
    label: '操作状态',
    width: "10%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'status',
      placeholder: '操作状态',
      label: '状态',
      order: 4,
      dictType: 'sys_common_status',
    },
    slot: 'status',
  },
  {
    fieldName: 'operTime',
    label: '操作日期',
    width: "16%",
    minWidth: 180,
    align: 'center',
    slot: 'operTime',
    sortable: true,
  },
  {
    fieldName: 'costTime',
    label: '消耗时间',
    width: "12%",
    minWidth: 130,
    align: 'center',
    slot: 'costTime',
    sortable: true,
  },
];

export const getHeaderButs = (onDelete, onClean, onExport) => [
  {
    label: '删除',
    type: 'danger',
    icon: 'Delete',
    size: 'default',
    onClick: onDelete,
    permission: 'monitor:operlog:remove',
  },
  {
    label: '清空',
    type: 'danger',
    icon: 'Delete',
    size: 'default',
    onClick: onClean,
    permission: 'monitor:operlog:remove',
  },
  {
    label: '导出',
    type: 'warning',
    icon: 'Download',
    size: 'default',
    onClick: onExport,
    permission: 'monitor:operlog:export',
  },
];

export const getOperationColumn = (onView) => {
  return {
    label: '操作',
    width: 80,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '详细',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'View',
        link: true,
        permission: 'monitor:operlog:query',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs,
  getOperationColumn
};
