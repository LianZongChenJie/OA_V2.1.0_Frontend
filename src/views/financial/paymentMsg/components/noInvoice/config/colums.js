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
    fieldName: 'enterStatus',
    label: '回款状态',
    width: "15%",
    minWidth: 120,
    align: 'center',
    isDict: true,
    dict: 'enter_status',
    searchable: {
      type: 'select',
      dictKey: 'enter_status',
      fieldName: 'enterStatus',
      placeholder: '请选择回款状态',
      label: '回款状态',
      order: 5,
    },
  },
  {
    fieldName: 'amount',
    label: '预回款金额(元)',
    width: "10%",
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'checkStatus',
    label: '审批状态',
    width: "15%",
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
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'adminName',
    label: '回款员工',
    width: "10%",
    minWidth: 100,
    show: false,
  },
  {
    fieldName: 'deptName',
    label: '所属部门',
    width: "15%",
    minWidth: 100,
    show: false,
  },
  {
    fieldName: 'createTime',
    label: '申请时间',
    width: "15%",
    minWidth: 120,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, onOpen, onInvalidate, onFundDetail) => {
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
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.openStatus) === 0 && Number(row.enterStatus) === 2,
        onClick: (row) => {
          onOpen && onOpen(row);
        },
        icon: 'documentation',
      },
      {
        label: '冲红发票',
        type: 'danger',
        size: 'small',
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.openStatus) === 1 && Number(row.enterStatus) === 2,
        onClick: (row) => {
          onInvalidate && onInvalidate(row);
        },
        icon: 'delete',
      },
      {
        label: '回款详情',
        type: 'success',
        size: 'small',
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.openStatus) === 0 && [0, 1].includes(Number(row.enterStatus)),
        onClick: (row) => {
          onFundDetail && onFundDetail(row);
        },
        icon: 'enter',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
