import { formatDate } from '@/utils/index'

export const columns = [
  {
    fieldName: 'userId',
    label: 'ID',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'userType',
    label: '员工类型',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'userName',
    label: '登录账号',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'nickName',
    label: '员工姓名',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'phonenumber',
    label: '手机号',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'email',
    label: '电子邮箱',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'sex',
    label: '性别',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'did',
    label: '所在主部门',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'deptName',
    label: '所在次部门',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'postName',
    label: '岗位职称',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'entryDate',
    label: '入职日期',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.entryDate),
  },
  {
    fieldName: 'loginDate',
    label: '登录次数',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'loginIp',
    label: '最后登录IP',
    width: "10%",
    minWidth: 100,
    align: 'center',
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
