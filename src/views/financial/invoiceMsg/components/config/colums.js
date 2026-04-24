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
    fieldName: 'invoiceTitle',
    label: '发票抬头',
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
    fieldName: 'adminId',
    label: '申请员工',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择申请员工',
      label: '申请员工',
      order: 3,
    },
  },
  {
    fieldName: 'did',
    label: '申请部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '申请时间',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'checkUids',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'openStatus',
    label: '开票状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'open_status',
    searchable: {
      type: 'select',
      dictKey: 'open_status',
      fieldName: 'openStatus',
      placeholder: '请选择开票状态',
      label: '开票状态',
      order: 4,
    },
  },
  {
    fieldName: 'openAdminId',
    label: '开票人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'openTime',
    label: '开票日期',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'code',
    label: '开票号码',
    width: 150,
    minWidth: 120,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, onOpen) => {
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
      {
        label: '开票',
        type: 'warning',
        size: 'small',
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.openStatus) === 0,
        onClick: (row) => {
          onOpen && onOpen(row);
        },
        icon: 'document',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
