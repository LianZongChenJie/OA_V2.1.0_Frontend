import { formatDate } from '@/utils/index'

export const columns = [
  {
    fieldName: 'checkStatus',
    label: '审批状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'uid',
    label: '员工姓名',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'fromDid',
    label: '调出部门',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'toDid',
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
    fieldName: 'adminId',
    label: '申请人',
    width: "10%",
    minWidth: 100,
    align: 'center',
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

export const operationColumn = {
  label: '操作',
  width: 200,
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
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        console.log('===删除', row)
      },
      icon: 'delete',
    },
  ],
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onDelete, onView) => {
  return {
    label: '操作',
    width: 200,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '编辑',
        type: 'success',
        size: 'small',
        onClick: (row) => {
          onEdit && onEdit(row);
        },
        icon: 'edit',
      },
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
  operationColumn,
  getHeaderButs
};