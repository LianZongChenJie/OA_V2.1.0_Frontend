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
    fieldName: 'customerName',
    label: '供应商[发票主体]',
    minWidth: 200,
  },
  {
    fieldName: 'amount',
    label: '发票金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'invoiceType',
    label: '开票类型',
    width: 150,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'invoice_type',
    searchable: {
      type: 'select',
      dictKey: 'invoice_type',
      fieldName: 'invoiceType',
      placeholder: '请选择开票类型',
      label: '开票类型',
      order: 1,
    },
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
      order: 2,
    },
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'adminName',
    label: '收票员工',
    width: 120,
    minWidth: 100,
    show: false,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择收票员工',
      label: '收票员工',
      order: 3,
    },
  },
  {
    fieldName: 'deptName',
    label: '收票部门',
    width: 120,
    minWidth: 100,
    show: false,
  },
  {
    fieldName: 'openStatus',
    label: '发票状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'open_status',
    searchable: {
      type: 'select',
      dictKey: 'open_status',
      fieldName: 'openStatus',
      placeholder: '请选择发票状态',
      label: '发票状态',
      order: 4,
    },
  },
  {
    fieldName: 'openTime',
    label: '收票时间',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'code',
    label: '发票号码',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'payStatus',
    label: '付款状态',
    width: 150,
    minWidth: 120,
    align: 'center',
    isDict: true,
    dict: 'open_status',
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, onOpen, onPaymentDetail, currentUserId) => {
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
        isShow: (row) => Number(row.checkStatus) === 0 && Number(row.adminId) === Number(currentUserId),
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
        isShow: (row) => Number(row.checkStatus) === 0 && Number(row.adminId) === Number(currentUserId),
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
      {
        label: '付款',
        type: 'warning',
        size: 'small',
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.openStatus) === 1 ,
        onClick: (row) => {
          onPaymentDetail && onPaymentDetail(row);
        },
        icon: 'documentation',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
