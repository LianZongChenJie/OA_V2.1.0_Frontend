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
    label: '借支金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
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
    fieldName: 'adminId',
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
    fieldName: 'did',
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
    fieldName: 'checkUids',
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
    fieldName: 'payAdminId',
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
        isShow: (row) => Number(row.checkStatus) === 0,
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
        isShow: (row) => Number(row.checkStatus) === 0,
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
