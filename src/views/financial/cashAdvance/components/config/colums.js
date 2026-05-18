import { listUser } from '@/api/system/user.js';
import auth from '@/plugins/auth.js';
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
    label: '借支金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'checkStatus',
    label: '审批状态',
    width: 100,
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
    fieldName: 'balanceCost',
    label: '已冲抵金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'balanceStatus',
    label: '冲抵状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'balance_status',
    searchable: {
      type: 'select',
      dictKey: 'balance_status',
      fieldName: 'balanceStatus',
      placeholder: '请选择冲抵状态',
      label: '冲抵状态',
      order: 1,
    },
  },
  {
    fieldName: 'types',
    label: '借支类型',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'cash_advance_types',
    searchable: {
      type: 'select',
      dictKey: 'cash_advance_types',
      fieldName: 'types',
      placeholder: '请选择借支类型',
      label: '借支类型',
      order: 2,
    },
  },
  {
    fieldName: 'planTime',
    label: '计划归还日期',
    width: 130,
    minWidth: 110,
  },
  {
    fieldName: 'adminName',
    label: '借支员工',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择借支员工',
      label: '借支员工',
      order: 3,
    },
  },
  {
    fieldName: 'deptName',
    label: '借支部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'title',
    label: '借支主题',
    minWidth: 200,
  },
  {
    fieldName: 'content',
    label: '借支理由',
    minWidth: 200,
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'payStatus',
    label: '打款状态',
    width: 100,
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
      order: 4,
    },
  },
  {
    fieldName: 'payName',
    label: '打款人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'payTime',
    label: '打款时间',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'backStatus',
    label: '还款状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'cash_back_status',
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, onBack, onPay, currentUserId) => {
  return {
    label: '操作',
    width: 170,
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
        label: '删除',
        type: 'danger',
        size: 'small',
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)),
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
      {
        label: '打款',
        type: 'warning',
        size: 'small',
        isShow: (row) => auth.hasPermi('finance:loan:pay') && Number(row.checkStatus) === 2 && Number(row.payStatus) === 0,
        onClick: (row) => {
          onPay && onPay(row);
        },
        icon: 'money',
      },
      {
        label: '还款',
        type: 'success',
        size: 'small',
        isShow: (row) => auth.hasPermi('finance:loan:back') && Number(row.checkStatus) === 2 && Number(row.payStatus) === 1 && Number(row.adminId) === Number(currentUserId) && Number(row.backStatus) === 0,
        onClick: (row) => {
          onBack && onBack(row);
        },
        icon: 'money',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
