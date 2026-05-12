import { listUser } from '@/api/system/user.js';

export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'cost',
    label: '报销总金额(元)',
    width: "10%",
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'checkStatus',
    label: '审批状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'check_status',
    searchable: {
      type: 'select',
      dictKey: 'check_status',
      fieldName: 'checkStatus',
      placeholder: '请选择审批状态',
      label: '审批状态',
      order: 1,
    },
  },
  {
    fieldName: 'adminName',
    label: '报销员工',
    width: "10%",
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择报销员工',
      label: '报销员工',
      order: 2,
    },
  },
  {
    fieldName: 'deptName',
    label: '报销部门',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'code',
    label: '报销凭证编号',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'expenseTime',
    label: '原始单据日期',
    width: "10%",
    minWidth: 110,
  },
  {
    fieldName: 'incomeMonth',
    label: '入账月份',
    width: "10%",
    minWidth: 90,
  },
  {
    fieldName: 'createTime',
    label: '录入时间',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'payStatus',
    label: '打款状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'cash_pay_status',
    searchable: {
      type: 'select',
      dictKey: 'cash_pay_status',
      fieldName: 'payStatus',
      placeholder: '请选择打款状态',
      label: '打款状态',
      order: 3,
    },
  },
  {
    fieldName: 'payName',
    label: '打款人',
    width: "10%",
    minWidth: 80,
  },
  {
    fieldName: 'payTime',
    label: '打款时间',
    width: "10%",
    minWidth: 120,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, onPay, currentUserId) => {
  return {
    label: '操作',
    width: 180,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '编辑',
        type: 'success',
        size: 'small',
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)) && Number(row.adminId) === Number(currentUserId),
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
        label: '打款',
        type: 'warning',
        size: 'small',
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.payStatus) === 0,
        onClick: (row) => {
          onPay && onPay(row);
        },
        icon: 'money',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'small',
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)) && Number(row.adminId) === Number(currentUserId),
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
