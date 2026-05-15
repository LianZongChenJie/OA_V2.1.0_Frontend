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
    fieldName: 'uidName',
    label: '离职员工',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'uid',
      placeholder: '请选择离职员工',
      label: '离职员工',
      order: 2,
    },
  },
  {
    fieldName: 'leadAdminIdName',
    label: '上级领导',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'leadAdminId',
      placeholder: '请选择上级领导',
      label: '上级领导',
      order: 3,
    },
  },
  {
    fieldName: 'connectIdName',
    label: '交接人',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'connectId',
      placeholder: '请选择交接人',
      label: '交接人',
      order: 4,
    },
  },
  {
    fieldName: 'connectTimeStr',
    label: '交接时间',
    width: 160,
    minWidth: 120,
  },
  {
    fieldName: 'quitTimeStr',
    label: '离职时间',
    width: 160,
    minWidth: 120,
  },
  {
    fieldName: 'remark',
    label: '离职原因',
    minWidth: 200,
  },
  {
    fieldName: 'createTimeStr',
    label: '申请时间',
    width: 160,
    minWidth: 120,
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增离职申请', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
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
        isShow: (row) => [0, 3, 4].includes(Number(row.checkStatus)) && Number(row.uid) === Number(currentUserId),
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
