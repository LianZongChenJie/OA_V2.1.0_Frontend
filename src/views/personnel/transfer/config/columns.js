import { formatDate } from '@/utils/index'
import { listUser } from '@/api/system/user.js'

export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "10%",
    minWidth: 80,
    align: 'center',
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
    fieldName: 'nickName',
    label: '员工姓名',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'fromName',
    label: '调出部门',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'toName',
    label: '调入部门',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '执行状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'personnel_transfer_status',
    searchable: {
      type: 'select',
      dictKey: 'personnel_transfer_status',
      fieldName: 'status',
      placeholder: '请选择执行状态',
      label: '执行状态',
      order: 2,
    },
  },
  {
    fieldName: 'moveTime',
    label: '调动日期',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.moveTime),
  },
  {
    fieldName: 'remark',
    label: '调动原因',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'adminName',
    label: '申请人',
    width: "10%",
    minWidth: 100,
    align: 'center',
    show: false,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择申请人',
      label: '申请人',
      order: 3,
    },
  },
  {
    fieldName: 'createTime',
    label: '申请时间',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.createTime),
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onDelete, onView, onTransfer) => {
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
        // 只有审批状态为待提交(0)、已驳回(3)、已撤回(4)时才可编辑
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)),
        onClick: (row) => {
          onEdit && onEdit(row);
        },
        icon: 'edit',
      },
      {
        label: '查看',
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
        // 只有审批状态为待提交(0)、已驳回(3)、已撤回(4)时才可删除
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)),
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
      {
        label: '调动',
        type: 'warning',
        size: 'small',
        // 审批状态为已通过(1) 且 执行状态为暂未调动(0) 时才显示
        isShow: (row) => Number(row.checkStatus) === 2 && Number(row.status) === 1,
        onClick: (row) => {
          onTransfer && onTransfer(row);
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
