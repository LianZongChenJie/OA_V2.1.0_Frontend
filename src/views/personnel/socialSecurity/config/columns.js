import { formatDate } from '@/utils/index'
import { listUser } from '@/api/system/user.js'

export const columns = [
  {
    fieldName: 'city',
    label: '所属城市',
    width: "20%",
    minWidth: 100,
    align: 'center',
    format: (val) => (val || '').replace(/,/g, '/'),
    searchable: {
      type: 'input',
      placeholder: '请输入城市',
      label: '所属城市',
      order: 0,
    },
  },
  {
    fieldName: 'projectName',
    label: '所在项目',
    width: "25%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'input',
      searchParam: 'projectName',
      placeholder: '请输入项目名称',
      label: '所在项目',
      order: 1,
    },
  },
  {
    fieldName: 'socialDate',
    label: '社保结算时间',
    width: "20%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'relatedUsers',
    label: '关联人员',
    width: "10%",
    minWidth: 160,
    align: 'center',
  },
  {
    fieldName: 'manager',
    label: '负责人',
    width: "10%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      searchParam: 'managerId',
      searchParam: 'nickName',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'managerId',
      placeholder: '请选择负责人',
      label: '负责人',
      order: 2,
    },
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.createTime),
  }
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
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
      },
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
      }
    ],
  };
};