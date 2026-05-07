export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'month',
    label: '月份',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'tenderLeader',
    label: '标书负责人',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'input',
      fieldName: 'tenderLeader',
      placeholder: '请输入标书负责人',
      label: '标书负责人',
      order: 0,
    },
  },
  {
    fieldName: 'purchaseDate',
    label: '购买日期',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'customerName',
    label: '客户名称',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'projectName',
    label: '项目名称',
    width: 200,
    minWidth: 150,
    searchable: {
      type: 'input',
      fieldName: 'projectName',
      placeholder: '请输入项目名称',
      label: '项目名称',
      order: 1,
    },
  },
  {
    fieldName: 'tenderAgency',
    label: '招标机构',
    width: 150,
    minWidth: 120,
    searchable: {
      type: 'input',
      fieldName: 'tenderAgency',
      placeholder: '请输入招标机构',
      label: '招标机构',
      order: 2,
    },
  },
  {
    fieldName: 'projectCycle',
    label: '项目周期',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'shortlistedCountries',
    label: '入围家数',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'budgetAmount',
    label: '预算金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'bidOpeningDate',
    label: '开标日期',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'date',
      fieldName: 'bidOpeningDate',
      placeholder: '请选择开标日期',
      label: '开标日期',
      order: 3,
    },
  },
  {
    fieldName: 'tenderDocumentFee',
    label: '标书款(元)',
    width: 120,
    minWidth: 100,
    align: 'right',
  },
  {
    fieldName: 'hasTenderInvoice',
    label: '标书款发票',
    width: 110,
    minWidth: 90,
    align: 'center',
  },
  {
    fieldName: 'isTenderSubmitted',
    label: '是否投标',
    width: 100,
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 'sys_yes_no',
    searchable: {
      type: 'select',
      dictKey: 'sys_yes_no',
      fieldName: 'isTenderSubmitted',
      placeholder: '请选择是否投标',
      label: '是否投标',
      order: 4,
    },
  },
  {
    fieldName: 'nonTenderReason',
    label: '未投原因',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'isDepositPaid',
    label: '是否缴纳保证金',
    width: 130,
    minWidth: 110,
    align: 'center',
    isDict: true,
    dict: 'sys_yes_no',
  },
  {
    fieldName: 'tenderDeposit',
    label: '保证金金额(元)',
    width: 140,
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'depositPaidTime',
    label: '保证金缴纳截止日期',
    width: 160,
    minWidth: 140,
  },
  {
    fieldName: 'depositAccountName',
    label: '保证金账户名',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'depositAccountNo',
    label: '保证金账号',
    width: 180,
    minWidth: 150,
  },
  {
    fieldName: 'depositBank',
    label: '开户银行',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'isDepositRefunded',
    label: '是否退回保证金',
    width: 130,
    minWidth: 110,
    align: 'center',
    isDict: true,
    dict: 'sys_yes_no',
  },
  {
    fieldName: 'bidResult',
    label: '中标结果',
    width: 100,
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 'bid_result',
    searchable: {
      type: 'select',
      dictKey: 'bid_result',
      fieldName: 'bidResult',
      placeholder: '请选择中标结果',
      label: '中标结果',
      order: 5,
    },
  },
  {
    fieldName: 'bidServiceFee',
    label: '中标服务费(元)',
    width: 140,
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
  {
    fieldName: 'updateTime',
    label: '更新时间',
    width: 180,
    minWidth: 160,
  },
];

export const operationColumn = {
  label: '操作',
  width: 180,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row, onEdit) => {
        onEdit && onEdit(row);
      },
      icon: 'edit',
    },
  ],
};

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
        isShow: (row) => Number(row.checkStatus) === 2,
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
        isShow: (row) => Number(row.checkStatus) === 2,
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
  operationColumn,
  getHeaderButs
};
