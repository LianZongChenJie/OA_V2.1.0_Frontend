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
    fieldName: 'startDate',
    label: '开始时间',
    width: 150,
    minWidth: 140,
    align: 'center',
  },
  {
    fieldName: 'endDate',
    label: '结束时间',
    width: 150,
    minWidth: 140,
    align: 'center',
  },
  {
    fieldName: 'duration',
    label: '请假天数',
    width: 100,
    minWidth: 90,
    align: 'center',
  },
  {
    fieldName: 'types',
    label: '请假类型',
    width: 120,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'leavel_types',
    searchable: {
      type: 'select',
      dictKey: 'leavel_types',
      fieldName: 'types',
      placeholder: '请选择请假类型',
      label: '请假类型',
      order: 1,
    },
  },
  {
    fieldName: 'reason',
    label: '请假原因',
    minWidth: 200,
  },
  {
    fieldName: 'adminName',
    label: '申请人',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'adminId',
      placeholder: '请选择申请人',
      label: '申请人',
      order: 2,
    },
  },
  {
    fieldName: 'deptName',
    label: '所属部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '申请时间',
    width: 150,
    minWidth: 140,
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
      order: 3,
    },
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete, currentUserId) => {
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
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
