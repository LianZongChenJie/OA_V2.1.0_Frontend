export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "5%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'amount',
    label: '付款金额(元)',
    width: "10%",
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'payTime',
    label: '付款时间',
    width: "10%",
    minWidth: 120,
    format: (val) => val?.split(' ')[0] || '',
  },
  {
    fieldName: 'ticketCode',
    label: '发票编码',
    width: "10%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'invoiceTitle',
    label: '发票抬头',
    width: "20%",
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'invoiceTitle',
      placeholder: '请输入发票抬头',
      label: '发票抬头',
    },
  },
  {
    fieldName: 'adminName',
    label: '申请人',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'deptName',
    label: '申请部门',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '发票申请时间',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'remarks',
    label: '备注信息',
    width: "20%",
    minWidth: 200,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onDelete) => {
  return {
    label: '操作',
    width: 96,
    fixed: 'right',
    show: true,
    actions: [
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
